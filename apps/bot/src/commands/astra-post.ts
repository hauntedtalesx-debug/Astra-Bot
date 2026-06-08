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
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (!guildId) return interaction.reply({ content: 'Apenas para servidores.', ephemeral: true });

    if (subcommand === 'configurar') {
      const channelId = interaction.options.getChannel('canal')!.id;
      const type = interaction.options.getString('tipo')!;
      const frequency = interaction.options.getString('frequencia')!;
      const time = interaction.options.getString('horario')!;

      // Validar regex do horário
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
        return interaction.reply({ content: 'Horário inválido. Use o formato HH:mm (ex: 14:30)', ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      try {
        await prisma.autoPostSchedule.create({
          data: {
            guildId,
            channelId,
            frequency,
            time,
            type
          }
        });

        await interaction.editReply(`✅ Agendamento criado! A Astra enviará posts do tipo **${type}** no canal <#${channelId}> às **${time}** (${frequency}).`);
      } catch (error) {
        await interaction.editReply('❌ Erro ao criar o agendamento.');
      }
    }

    if (subcommand === 'status') {
      await interaction.deferReply({ ephemeral: true });
      const schedules = await prisma.autoPostSchedule.findMany({ where: { guildId } });
      if (schedules.length === 0) return interaction.editReply('Não há posts automáticos configurados.');

      let response = '**📅 Posts Automáticos Configurados:**\n\n';
      schedules.forEach((s, index) => {
        response += `**${index + 1}.** Canal: <#${s.channelId}> | Tipo: ${s.type} | Hora: ${s.time} | Freq: ${s.frequency} | Ativo: ${s.active ? 'Sim' : 'Não'}\n`;
      });

      await interaction.editReply(response);
    }
  },
};
