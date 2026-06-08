import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Mostra todos os comandos e informações do Astra.'),
    
  async execute(interaction: ChatInputCommandInteraction) {
    const supportServerUrl = process.env.SUPPORT_SERVER_URL || 'https://discord.gg/astra';
    const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';

    const embed = new EmbedBuilder()
      .setColor('#9b59b6')
      .setTitle('🌟 Ajuda - Astra Bot')
      .setDescription('Eu sou a Astra, sua assistente de comunidade com IA! Aqui estão meus principais comandos:')
      .addFields(
        { name: '🔧 Configuração (Admins)', value: '`/setup` - Configuração inicial\n`/dados servidor` - Visualiza os dados armazenados\n`/dados apagar` - Apaga os dados do servidor' },
        { name: '📊 Engajamento', value: '`/ranking` - Mostra a atividade da comunidade\n`/astra-post` - Gerencia os posts automáticos' },
        { name: '❓ Utilidades', value: '`/faq adicionar` - Adiciona uma pergunta frequente\n`/faq perguntar` - Busca uma resposta no FAQ' },
        { name: '⭐ Premium', value: '`/plano` - Detalhes do plano atual' }
      )
      .setFooter({ text: 'Astra - Mantendo sua comunidade ativa!' })
      .setTimestamp();

    await interaction.reply({ 
      embeds: [embed], 
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: 'Suporte',
              url: supportServerUrl
            },
            {
              type: 2,
              style: 5,
              label: 'Dashboard',
              url: dashboardUrl
            }
          ]
        }
      ]
    });
  },
};
