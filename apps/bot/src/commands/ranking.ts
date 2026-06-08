import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';

export default {
  data: new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Mostra a atividade da comunidade (Ranking).'),
    
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const guildId = interaction.guildId;

    if (!guildId) return interaction.editReply('Erro: Comando apenas para servidores.');

    try {
      const topMembers = await prisma.memberActivity.findMany({
        where: { guildId },
        orderBy: { messageCount: 'desc' },
        take: 10
      });

      if (topMembers.length === 0) {
        return interaction.editReply('Ainda não há atividade registrada na comunidade.');
      }

      const embed = new EmbedBuilder()
        .setTitle('🏆 Atividade da Comunidade')
        .setColor('#f1c40f')
        .setDescription('Top 10 membros mais ativos:');

      let list = '';
      for (let i = 0; i < topMembers.length; i++) {
        const m = topMembers[i];
        list += `**${i + 1}.** <@${m.userId}> - ${m.messageCount} mensagens\n`;
      }

      embed.addFields({ name: 'Ranking', value: list });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('Erro ao carregar o ranking.');
    }
  },
};
