import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';

const DAYS_OF_WEEK = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default {
  data: new SlashCommandBuilder()
    .setName('comunidade')
    .setDescription('Comandos públicos para a comunidade do servidor.')
    
    // RANKING
    .addSubcommand(sub => sub.setName('ranking').setDescription('Mostra o ranking de engajamento do servidor')
      .addStringOption(opt => opt.setName('periodo').setDescription('Período do ranking').setRequired(true).addChoices(
        { name: 'Geral', value: 'geral' },
        { name: 'Semanal', value: 'semanal' },
        { name: 'Mensal', value: 'mensal' }
      ))
    )

    // ESTATÍSTICAS
    .addSubcommand(sub => sub.setName('estatisticas').setDescription('Mostra as estatísticas gerais deste servidor'))

    // SALDO
    .addSubcommand(sub => sub.setName('saldo').setDescription('Verifica o seu saldo de AstraCoins na loja.')
      .addUserOption(opt => opt.setName('usuario').setDescription('Ver o saldo de outro usuário').setRequired(false))
    )

    // PERFIL
    .addSubcommand(sub => sub.setName('perfil').setDescription('Exibe o seu cartão de perfil customizado.')
      .addUserOption(opt => opt.setName('usuario').setDescription('Ver o perfil de outro usuário').setRequired(false))
    )

    // AGENDA
    .addSubcommand(sub => sub.setName('agenda').setDescription('Mostra a programação de lives e vídeos da semana'))

    // FAQ
    .addSubcommand(sub => sub.setName('faq').setDescription('Lista todas as perguntas frequentes (FAQ)'))

    // CLIPE
    .addSubcommand(sub => sub.setName('clipe').setDescription('Envia um clipe da live para o streamer ver')
      .addStringOption(opt => opt.setName('url').setDescription('Link do clipe (Twitch, Kick, YouTube)').setRequired(true))
      .addStringOption(opt => opt.setName('descricao').setDescription('Descrição do clipe').setRequired(false))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (!guildId) return interaction.reply({ content: 'Apenas para servidores.', ephemeral: true });

    if (subcommand === 'ranking') {
      await interaction.deferReply();
      const periodo = interaction.options.getString('periodo', true);
      
      let orderByField: 'messageCount' | 'weeklyMessageCount' | 'monthlyMessageCount' = 'messageCount';
      let title = '🏆 Ranking Geral Histórico';
      
      if (periodo === 'semanal') { orderByField = 'weeklyMessageCount'; title = '🏆 Ranking da Semana'; } 
      else if (periodo === 'mensal') { orderByField = 'monthlyMessageCount'; title = '🏆 Ranking do Mês'; }

      try {
        const topMembers = await prisma.memberActivity.findMany({ where: { guildId }, orderBy: { [orderByField]: 'desc' }, take: 10 });
        const activeMembers = topMembers.filter(m => m[orderByField] > 0);

        if (activeMembers.length === 0) return interaction.editReply(`Ainda não há atividade registrada para o ranking ${periodo}.`);

        const embed = new EmbedBuilder().setTitle(title).setColor('#f1c40f').setDescription(`Top ${activeMembers.length} membros mais ativos:`);
        let list = '';
        activeMembers.forEach((m, i) => list += `**${i + 1}.** <@${m.userId}> - ${m[orderByField]} mensagens\n`);
        embed.addFields({ name: 'Classificação', value: list });

        await interaction.editReply({ embeds: [embed] });
      } catch (e) {
        await interaction.editReply('Erro ao carregar o ranking.');
      }
      return;
    }

    if (subcommand === 'estatisticas') {
      await interaction.deferReply();
      const guild = await prisma.guild.findUnique({
        where: { id: guildId }, include: { settings: true, _count: { select: { members: true, faqs: true, autoPosts: true } } }
      });

      if (!guild) return interaction.editReply('Astra ainda não está configurada neste servidor.');

      const embed = new EmbedBuilder()
        .setTitle(`Estatísticas - ${guild.name}`)
        .setColor('#3498db')
        .addFields(
          { name: 'Membros Ativos', value: guild._count.members.toString(), inline: true },
          { name: 'FAQs Cadastradas', value: guild._count.faqs.toString(), inline: true },
          { name: 'Idioma', value: guild.settings?.language || 'pt-BR', inline: true }
        );
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'saldo') {
      const targetUser = interaction.options.getUser('usuario') || interaction.user;
      
      // Saldo global (Dashboard)
      const profile = await prisma.userProfile.findUnique({ where: { userId: targetUser.id } });
      const globalCoins = profile?.astraCoins || 0;
      
      // Saldo local (Servidor atual)
      const activity = await prisma.memberActivity.findUnique({ where: { guildId_userId: { guildId, userId: targetUser.id } } });
      const localPoints = activity?.points || 0;
      
      await interaction.reply({ 
        content: `💰 ${targetUser.id === interaction.user.id ? 'Você tem' : `<@${targetUser.id}> tem`} **${globalCoins} AstraCoins** (Globais) e **${localPoints} Pontos** (neste servidor)!`, 
        ephemeral: true 
      });
      return;
    }

    if (subcommand === 'perfil') {
      await interaction.deferReply();
      const targetUser = interaction.options.getUser('usuario') || interaction.user;
      
      const profile = await prisma.userProfile.findUnique({ where: { userId: targetUser.id } });
      const activity = await prisma.memberActivity.findUnique({ where: { guildId_userId: { guildId, userId: targetUser.id } } });
      
      const globalCoins = profile?.astraCoins || 0;
      const reputation = profile?.reputation || 0;
      const level = activity?.level || 1;
      const xp = activity?.xp || 0;
      
      const bgImage = profile?.backgroundUrl || 'https://via.placeholder.com/600x200/101524/ffffff?text=Fundo+Padrao';
      const layout = profile?.layoutId || 'default';
      
      let color: any = '#3498db';
      if (layout === 'cyberpunk') color = '#ff00ff';
      if (layout === 'anime') color = '#ff99cc';
      if (layout === 'compact') color = '#2ecc71';

      const embed = new EmbedBuilder()
        .setTitle(`Perfil de ${targetUser.username}`)
        .setColor(color)
        .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
        .setImage(bgImage)
        .addFields(
          { name: '🌟 Nível', value: `${level} (${xp} XP)`, inline: true },
          { name: '💎 AstraCoins', value: `${globalCoins}`, inline: true },
          { name: '👍 Reputação', value: `${reputation}`, inline: true }
        );

      if (layout === 'compact') {
         embed.setDescription(`Nível: ${level} | Moedas: ${globalCoins} | Reputação: ${reputation}`);
         embed.setFields([]); // Remove fields if compact
      }

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'agenda') {
      await interaction.deferReply();
      const events = await prisma.creatorSchedule.findMany({ where: { guildId }, orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }] });
      
      if (events.length === 0) return interaction.editReply("Nenhum evento na agenda no momento.");

      const embed = new EmbedBuilder().setTitle("📅 Agenda da Semana").setColor("#00FFFF").setDescription("Confira nossa programação dos próximos dias!");

      const grouped: Record<number, typeof events> = {};
      for (const e of events) { if (!grouped[e.dayOfWeek]) grouped[e.dayOfWeek] = []; grouped[e.dayOfWeek].push(e); }

      for (let i = 0; i < 7; i++) {
        if (grouped[i]) {
          const dayEvents = grouped[i].map((e) => `\`${e.time}\` ${e.isLive ? "🔴" : "▶️"} **${e.title}**`).join("\n");
          embed.addFields({ name: DAYS_OF_WEEK[i], value: dayEvents });
        }
      }
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'faq') {
      await interaction.deferReply();
      const faqs = await prisma.fAQItem.findMany({ where: { guildId } });
      if (faqs.length === 0) return interaction.editReply('Nenhum FAQ cadastrado.');

      const embed = new EmbedBuilder().setTitle('❓ FAQ - Perguntas Frequentes').setColor('#2ecc71');
      faqs.slice(0, 10).forEach(f => embed.addFields({ name: f.question, value: f.answer.substring(0, 1000) }));
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'clipe') {
      await interaction.deferReply({ ephemeral: true });
      const url = interaction.options.getString("url", true);
      const description = interaction.options.getString("descricao");

      const clipe = await prisma.clipSubmission.create({
        data: {
          guildId,
          userId: interaction.user.id,
          username: interaction.user.username,
          url,
          description,
        },
      });

      await interaction.editReply(`✅ Clipe enviado com sucesso! O streamer vai avaliar em breve.\\nID: \`${clipe.id}\``);
      return;
    }
  },
};
