import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';
import { Templates } from '@astra/shared';

export default {
  data: new SlashCommandBuilder()
    .setName('desafio')
    .setDescription('Gera um desafio interativo para a comunidade'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const guildId = interaction.guildId;
    if (!guildId) return interaction.editReply('Erro: Comando apenas para servidores.');

    try {
      const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
      const lang = settings?.language || 'pt-BR';
      const niche = settings?.niche || 'variedades';

      const templatesByLang = (Templates.desafio as any)[lang] || Templates.desafio['pt-BR'];
      const items = templatesByLang[niche] || templatesByLang['variedades'];
      
      const challenge = items[Math.floor(Math.random() * items.length)];

      const embed = new EmbedBuilder()
        .setTitle('⚔️ Desafio da Comunidade')
        .setColor('#e74c3c')
        .setDescription(challenge)
        .setFooter({ text: 'Cumpra o desafio no chat!' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Erro ao gerar desafio.');
    }
  },
};
