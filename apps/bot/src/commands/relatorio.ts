import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder, ChannelType } from 'discord.js';
import { prisma } from '@astra/db';

export default {
  data: new SlashCommandBuilder()
    .setName('relatorio')
    .setDescription('Gera um relatório de engajamento da comunidade')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand(subcmd => 
      subcmd.setName('gerar')
        .setDescription('Gera um relatório de engajamento manual agora')
    )
    .addSubcommand(subcmd => 
      subcmd.setName('semanal')
        .setDescription('Configura o canal para receber o relatório automático aos domingos')
        .addChannelOption(opt => opt.setName('canal').setDescription('Canal de relatórios').setRequired(true).addChannelTypes(ChannelType.GuildText))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (!guildId) return interaction.reply({ content: 'Apenas servidores.', ephemeral: true });

    if (subcommand === 'semanal') {
      const channel = interaction.options.getChannel('canal', true);
      await interaction.deferReply({ ephemeral: true });
      try {
        await prisma.guildSettings.upsert({
          where: { guildId },
          update: { weeklyReportChannelId: channel.id },
          create: { guildId, weeklyReportChannelId: channel.id }
        });
        await interaction.editReply(`✅ Relatório semanal configurado para o canal <#${channel.id}>. (Enviado todo domingo às 23:59)`);
      } catch (err) {
        await interaction.editReply('❌ Erro ao configurar relatório semanal.');
      }
    }

    if (subcommand === 'gerar') {
      await interaction.deferReply();
      try {
        const topMembers = await prisma.memberActivity.findMany({
          where: { guildId },
          orderBy: { weeklyMessageCount: 'desc' },
          take: 3
        });
        
        const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
        const niche = settings?.niche || 'variedades';
        
        let dicas = 'Mantenha a galera engajada com debates!';
        if (niche === 'games') dicas = 'Que tal um corujão ou campeonato no final de semana?';
        else if (niche === 'anime') dicas = 'Faça uma watchparty de um episódio lançamento!';

        const totalSemana = await prisma.memberActivity.aggregate({
          where: { guildId },
          _sum: { weeklyMessageCount: true }
        });

        const activeUsers = await prisma.memberActivity.count({
          where: { guildId, weeklyMessageCount: { gt: 0 } }
        });

        const embed = new EmbedBuilder()
          .setTitle('📊 Relatório de Engajamento da Astra')
          .setColor('#3498db')
          .addFields(
            { name: 'Total de Mensagens na Semana', value: `${totalSemana._sum.weeklyMessageCount || 0} mensagens`, inline: true },
            { name: 'Membros Ativos', value: `${activeUsers} membros falaram essa semana`, inline: true },
            { name: '🏆 Top Membros (Semana)', value: topMembers.length > 0 ? topMembers.map((m, i) => `${i + 1}. <@${m.userId}> (${m.weeklyMessageCount} msgs)`).join('\n') : 'Sem atividade registrada.' },
            { name: '💡 Sugestão da Astra para o Engajamento', value: dicas }
          )
          .setFooter({ text: 'Relatório gerado por Astra' })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
      } catch (err) {
        await interaction.editReply('❌ Erro ao gerar relatório.');
      }
    }
  },
};
