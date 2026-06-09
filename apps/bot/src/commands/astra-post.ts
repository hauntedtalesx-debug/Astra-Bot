import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, ChannelType } from 'discord.js';
import { prisma } from '@astra/db';

export default {
  data: new SlashCommandBuilder()
    .setName('astra-post')
    .setDescription('Gerencia os posts automáticos da Astra.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand(subcmd => 
      subcmd.setName('configurar')
        .setDescription('Agenda um novo tipo de post automático')
        .addChannelOption(opt => opt.setName('canal').setDescription('Onde o post será enviado').addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addStringOption(opt => opt.setName('tipo').setDescription('Tipo do post').setRequired(true).addChoices(
          { name: 'Pergunta do dia', value: 'pergunta' },
          { name: 'Enquete', value: 'enquete' },
          { name: 'Desafio', value: 'desafio' },
          { name: 'Meme', value: 'meme' }
        ))
        .addStringOption(opt => opt.setName('frequencia').setDescription('Frequência').setRequired(true).addChoices(
          { name: 'Diário', value: 'daily' },
          { name: '3 vezes por semana', value: '3_per_week' },
          { name: 'Semanal', value: 'weekly' }
        ))
        .addStringOption(opt => opt.setName('horario').setDescription('Horário (HH:mm) ex: 14:30').setRequired(true))
    )
    .addSubcommand(subcmd => 
      subcmd.setName('status')
        .setDescription('Mostra os posts agendados')
    )
    .addSubcommand(subcmd =>
      subcmd.setName('testar')
        .setDescription('Testa a geração de um post no canal atual')
        .addStringOption(opt => opt.setName('tipo').setDescription('Tipo do post').setRequired(true).addChoices(
          { name: 'Pergunta do dia', value: 'pergunta' },
          { name: 'Enquete', value: 'enquete' },
          { name: 'Desafio', value: 'desafio' },
          { name: 'Meme', value: 'meme' }
        ))
    )
    .addSubcommand(subcmd =>
      subcmd.setName('pausar')
        .setDescription('Pausa todos os posts automáticos no servidor')
    )
    .addSubcommand(subcmd =>
      subcmd.setName('retomar')
        .setDescription('Retoma os posts automáticos do servidor')
    )
    .addSubcommand(subcmd =>
      subcmd.setName('remover')
        .setDescription('Remove um agendamento pelo ID')
        .addStringOption(opt => opt.setName('id').setDescription('ID do agendamento (veja no /astra-post status)').setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (!guildId) return interaction.reply({ content: 'Apenas para servidores.', ephemeral: true });

    if (subcommand === 'configurar') {
      const channelId = interaction.options.getChannel('canal', true).id;
      const type = interaction.options.getString('tipo', true);
      const frequency = interaction.options.getString('frequencia', true);
      const time = interaction.options.getString('horario', true);

      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
        return interaction.reply({ content: 'Horário inválido. Use o formato HH:mm (ex: 14:30)', ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      try {
        await prisma.autoPostSchedule.create({
          data: { guildId, channelId, frequency, time, type }
        });
        await interaction.editReply(`✅ Agendamento criado! A Astra enviará posts do tipo **${type}** no canal <#${channelId}> às **${time}** (${frequency}).`);
      } catch (error) {
        await interaction.editReply('❌ Erro ao criar o agendamento.');
      }
    }

    if (subcommand === 'status') {
      await interaction.deferReply({ ephemeral: true });
      const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
      const schedules = await prisma.autoPostSchedule.findMany({ where: { guildId } });
      
      let response = `**Estado:** ${settings?.autoPostPaused ? '⏸️ Pausado' : '▶️ Ativo'}\n\n`;
      if (schedules.length === 0) {
        response += 'Não há posts automáticos configurados.';
      } else {
        response += '**📅 Posts Automáticos Configurados:**\n\n';
        schedules.forEach((s, index) => {
          response += `**ID:** \`${s.id}\` | Canal: <#${s.channelId}> | Tipo: ${s.type} | Hora: ${s.time} | Freq: ${s.frequency}\n`;
        });
      }
      await interaction.editReply(response);
    }

    if (subcommand === 'pausar') {
      await interaction.deferReply({ ephemeral: true });
      await prisma.guildSettings.upsert({
        where: { guildId },
        update: { autoPostPaused: true },
        create: { guildId, autoPostPaused: true }
      });
      await interaction.editReply('⏸️ Todos os posts automáticos foram pausados para este servidor.');
    }

    if (subcommand === 'retomar') {
      await interaction.deferReply({ ephemeral: true });
      await prisma.guildSettings.upsert({
        where: { guildId },
        update: { autoPostPaused: false },
        create: { guildId, autoPostPaused: false }
      });
      await interaction.editReply('▶️ Posts automáticos retomados com sucesso.');
    }

    if (subcommand === 'remover') {
      const id = interaction.options.getString('id', true);
      await interaction.deferReply({ ephemeral: true });
      try {
        await prisma.autoPostSchedule.deleteMany({
          where: { id, guildId } // Garante que é do mesmo servidor
        });
        await interaction.editReply(`🗑️ Agendamento \`${id}\` removido com sucesso.`);
      } catch (error) {
        await interaction.editReply('❌ Não foi possível remover (ID não encontrado).');
      }
    }

    if (subcommand === 'testar') {
      const type = interaction.options.getString('tipo', true);
      await interaction.deferReply({ ephemeral: true });
      // Lógica de template de teste
      const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
      const lang = settings?.language || 'pt-BR';
      const niche = settings?.niche || 'variedades';
      
      const Templates = await import('@astra/shared').then(m => m.Templates).catch(() => null);
      if (!Templates) {
         return interaction.editReply('❌ Erro interno ao carregar templates.');
      }
      
      let items = (Templates.pergunta as any)[lang]?.[niche] || Templates.pergunta['pt-BR']['variedades'];
      if (type === 'desafio' && Templates.desafio) {
        items = (Templates.desafio as any)[lang]?.[niche] || Templates.desafio['pt-BR']['variedades'];
      } else if (type === 'enquete' && Templates.enquete) {
        // Enquetes têm estrutura diferente, mas para teste simples podemos só avisar ou pegar a primeira
        items = Object.keys((Templates.enquete as any)[lang]?.[niche] || {}).map(q => q);
      }
      
      const postText = items[Math.floor(Math.random() * items.length)] || "Post de teste gerado!";
      
      if (interaction.channel && 'send' in interaction.channel) {
        await interaction.channel.send({ content: `**[TESTE: ${type.toUpperCase()}]**\n${postText}` });
      }
      await interaction.editReply('✅ Post de teste enviado no canal!');
    }
  },
};
