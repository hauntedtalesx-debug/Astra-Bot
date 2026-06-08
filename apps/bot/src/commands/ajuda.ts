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
        { name: '🔧 Configuração', value: '`/setup`, `/dados servidor`, `/dados apagar`\n`/ranking configurar`, `/relatorio semanal`' },
        { name: '📊 Engajamento & Ranking', value: '`/ranking geral`, `/ranking semanal`, `/ranking mensal`\n`/relatorio gerar`' },
        { name: '🤖 Posts Automáticos', value: '`/astra-post configurar`, `/astra-post status`, `/astra-post testar`\n`/astra-post pausar`, `/astra-post retomar`, `/astra-post remover`' },
        { name: '🎉 Criatividade & Interação', value: '`/pergunta`, `/enquete`, `/desafio`, `/reativar`' },
        { name: '❓ Utilidades', value: '`/faq adicionar`, `/faq perguntar`, `/faq listar`, `/faq remover`' }
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
