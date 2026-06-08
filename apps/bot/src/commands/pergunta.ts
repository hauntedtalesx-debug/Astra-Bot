import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';
import { Templates } from '@astra/shared';

export default {
  data: new SlashCommandBuilder()
    .setName('pergunta')
    .setDescription('Gera uma pergunta rápida para movimentar a comunidade'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const guildId = interaction.guildId;
    if (!guildId) return interaction.editReply('Erro: Comando apenas para servidores.');

    try {
      const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
      const lang = settings?.language || 'pt-BR';
      const niche = settings?.niche || 'variedades';

      // Type cast to handle dynamic keys safely
      const templatesByLang = (Templates.pergunta as any)[lang] || Templates.pergunta['pt-BR'];
      const items = templatesByLang[niche] || templatesByLang['variedades'];
      
      const question = items[Math.floor(Math.random() * items.length)];

      const embed = new EmbedBuilder()
        .setTitle('🤔 Pergunta do Dia')
        .setColor('#e67e22')
        .setDescription(question)
        .setFooter({ text: 'Responda abaixo!' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Erro ao gerar pergunta.');
    }
  },
};
