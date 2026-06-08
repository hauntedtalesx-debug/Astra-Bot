import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { prisma } from '@astra/db';
import { Templates } from '@astra/shared';

export default {
  data: new SlashCommandBuilder()
    .setName('reativar')
    .setDescription('Gera um plano de ação de 7 dias para reativar uma comunidade parada')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const guildId = interaction.guildId;
    if (!guildId) return interaction.editReply('Erro: Comando apenas para servidores.');

    try {
      const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
      const lang = settings?.language || 'pt-BR';
      const niche = settings?.niche || 'variedades';

      const templatesByLang = (Templates.reativacao as any)[lang] || Templates.reativacao['pt-BR'];
      const items: string[] = templatesByLang[niche] || templatesByLang['variedades'];

      const description = `Percebeu que o chat está meio parado? Aqui está um **Plano de Choque de 7 Dias** focado no nicho de \`${niche.toUpperCase()}\` para reviver o engajamento:\n\n` + items.join('\n');

      const embed = new EmbedBuilder()
        .setTitle('🚀 Plano de Reativação da Comunidade')
        .setColor('#9b59b6')
        .setDescription(description)
        .setFooter({ text: 'Dica da Astra: Agende um /astra-post para ajudar!' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Erro ao gerar plano.');
    }
  },
};
