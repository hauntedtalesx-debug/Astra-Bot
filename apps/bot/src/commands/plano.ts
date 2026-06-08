import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';

export default {
  data: new SlashCommandBuilder()
    .setName('plano')
    .setDescription('Veja detalhes do plano atual do servidor.'),
    
  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId;
    if (!guildId) return interaction.reply({ content: 'Comando apenas para servidores.', ephemeral: true });

    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = await prisma.guild.findUnique({
        where: { id: guildId },
        include: { settings: { include: { plan: true } } }
      });

      const planName = guild?.settings?.plan?.name || 'Free';
      const maxFaqs = guild?.settings?.plan?.maxFaqs || 10;
      
      const embed = new EmbedBuilder()
        .setTitle('💎 Seu Plano Astra')
        .setColor(planName === 'Pro' ? '#e67e22' : planName === 'Creator' ? '#e74c3c' : '#bdc3c7')
        .setDescription(`Este servidor está no plano **${planName}**.`)
        .addFields(
          { name: 'Status', value: 'Ativo', inline: true },
          { name: 'Limite de FAQs', value: `${maxFaqs}`, inline: true }
        )
        .setFooter({ text: 'Acesse o dashboard web para gerenciar sua assinatura.' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply('Erro ao carregar os dados do plano.');
    }
  },
};
