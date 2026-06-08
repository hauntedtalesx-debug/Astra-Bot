import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';

export default {
  data: new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Comandos de ranking e engajamento da comunidade')
    .addSubcommand(subcmd => 
      subcmd.setName('geral')
        .setDescription('Mostra o top 10 histórico do servidor')
    )
    .addSubcommand(subcmd => 
      subcmd.setName('semanal')
        .setDescription('Mostra o top 10 membros da semana')
    )
    .addSubcommand(subcmd => 
      subcmd.setName('mensal')
        .setDescription('Mostra o top 10 membros do mês')
    )
    .addSubcommand(subcmd => 
      subcmd.setName('configurar')
        .setDescription('Ignora canais para não somar XP (Apenas Admin)')
        .addChannelOption(opt => opt.setName('canal').setDescription('Canal a ignorar').setRequired(true))
    )
    .addSubcommand(subcmd => 
      subcmd.setName('resetar')
        .setDescription('Reseta o ranking do servidor inteiro (Apenas Admin)')
    ),
    
  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply();
    const guildId = interaction.guildId;

    if (!guildId) return interaction.editReply('Erro: Comando apenas para servidores.');

    if (subcommand === 'configurar' || subcommand === 'resetar') {
      const member = await interaction.guild?.members.fetch(interaction.user.id);
      if (!member?.permissions.has('Administrator')) {
         return interaction.editReply('❌ Apenas administradores podem usar este comando.');
      }
    }

    if (subcommand === 'configurar') {
      const channel = interaction.options.getChannel('canal', true);
      try {
        await prisma.ignoredChannel.upsert({
          where: { guildId_channelId: { guildId, channelId: channel.id } },
          update: {},
          create: { guildId, channelId: channel.id }
        });
        return interaction.editReply(`✅ O canal <#${channel.id}> foi adicionado à lista de ignorados para XP.`);
      } catch (err) {
        return interaction.editReply('❌ Erro ao configurar canal ignorado.');
      }
    }

    if (subcommand === 'resetar') {
      try {
        await prisma.memberActivity.deleteMany({ where: { guildId } });
        return interaction.editReply('⚠️ **Todos os rankings (Geral, Semanal e Mensal) foram zerados com sucesso para este servidor!**');
      } catch (err) {
        return interaction.editReply('❌ Erro ao resetar o ranking.');
      }
    }

    try {
      let orderByField: 'messageCount' | 'weeklyMessageCount' | 'monthlyMessageCount' = 'messageCount';
      let title = '🏆 Ranking Geral Histórico';
      
      if (subcommand === 'semanal') {
        orderByField = 'weeklyMessageCount';
        title = '🏆 Ranking da Semana';
      } else if (subcommand === 'mensal') {
        orderByField = 'monthlyMessageCount';
        title = '🏆 Ranking do Mês';
      }

      const topMembers = await prisma.memberActivity.findMany({
        where: { guildId },
        orderBy: { [orderByField]: 'desc' },
        take: 10
      });

      // Filter out members with 0 messages in the chosen ranking
      const activeMembers = topMembers.filter(m => m[orderByField] > 0);

      if (activeMembers.length === 0) {
        return interaction.editReply(`Ainda não há atividade registrada na comunidade para o ranking ${subcommand}.`);
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor('#f1c40f')
        .setDescription(`Top ${activeMembers.length} membros mais ativos:`);

      let list = '';
      for (let i = 0; i < activeMembers.length; i++) {
        const m = activeMembers[i];
        list += `**${i + 1}.** <@${m.userId}> - ${m[orderByField]} mensagens\n`;
      }

      embed.addFields({ name: 'Classificação', value: list });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('Erro ao carregar o ranking.');
    }
  },
};
