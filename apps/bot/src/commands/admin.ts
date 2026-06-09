import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, ChannelType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '@astra/db';
import { isAstraAdmin, checkBotPermissions } from '../utils/permissions';
import { Templates } from '@astra/shared';
import { createAstraEmbed, createSuccessEmbed, createErrorEmbed, createWarningEmbed, createPremiumEmbed } from '../utils/embeds';

export default {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Comandos administrativos para configuração do servidor.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    
    // SETUP
    .addSubcommand(sub => sub.setName('setup').setDescription('Configuração inicial do Astra no servidor.')
      .addChannelOption(opt => opt.setName('post-channel').setDescription('Canal para posts automáticos').addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addStringOption(opt => opt.setName('idioma').setDescription('Idioma do bot (pt-BR ou en-US)').setRequired(true).addChoices(
        { name: 'Português (BR)', value: 'pt-BR' }, { name: 'English (US)', value: 'en-US' }, { name: 'Español (ES)', value: 'es-ES' }, { name: 'Français (FR)', value: 'fr-FR' }, { name: '日本語 (JP)', value: 'ja-JP' }
      ))
      .addStringOption(opt => opt.setName('nicho').setDescription('Nicho da comunidade').setRequired(true).addChoices(
        { name: 'Games', value: 'games' }, { name: 'Anime', value: 'anime' }, { name: 'Tecnologia', value: 'tech' }, { name: 'Variedades', value: 'variedades' }
      ))
      .addStringOption(opt => opt.setName('streamer-name').setDescription('Nome do streamer/criador').setRequired(true))
      .addChannelOption(opt => opt.setName('ranking-channel').setDescription('Canal para exibir o ranking').addChannelTypes(ChannelType.GuildText))
      .addChannelOption(opt => opt.setName('log-channel').setDescription('Canal para logs internos').addChannelTypes(ChannelType.GuildText))
    )

    // PLANO
    .addSubcommand(sub => sub.setName('plano').setDescription('Veja detalhes do plano atual do servidor.'))

    // REATIVAR
    .addSubcommand(sub => sub.setName('reativar').setDescription('Gera um plano de ação de 7 dias para reativar uma comunidade parada.'))

    // RELATORIO
    .addSubcommandGroup(group => group.setName('relatorio').setDescription('Relatórios de engajamento')
      .addSubcommand(sub => sub.setName('gerar').setDescription('Gera um relatório de engajamento manual agora'))
      .addSubcommand(sub => sub.setName('semanal').setDescription('Configura o canal para receber o relatório automático aos domingos')
        .addChannelOption(opt => opt.setName('canal').setDescription('Canal de relatórios').setRequired(true).addChannelTypes(ChannelType.GuildText))
      )
    )

    // WELCOME
    .addSubcommandGroup(group => group.setName('welcome').setDescription('Mensagens de boas-vindas')
      .addSubcommand(sub => sub.setName('configurar').setDescription('Ativa ou atualiza as boas-vindas do servidor')
        .addChannelOption(opt => opt.setName('canal').setDescription('Canal onde a mensagem será enviada').addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addStringOption(opt => opt.setName('mensagem').setDescription('Use {user} para mencionar e {server} para o nome do servidor').setRequired(true))
        .addStringOption(opt => opt.setName('imagem').setDescription('URL de uma imagem (opcional)').setRequired(false))
      )
      .addSubcommand(sub => sub.setName('remover').setDescription('Desativa as boas-vindas automáticas'))
      .addSubcommand(sub => sub.setName('testar').setDescription('Simula como a mensagem vai aparecer'))
    )

    // STICKY
    .addSubcommandGroup(group => group.setName('sticky').setDescription('Mensagens fixadas no chat')
      .addSubcommand(sub => sub.setName('configurar').setDescription('Define a mensagem fixa para este canal')
        .addStringOption(opt => opt.setName('mensagem').setDescription('Texto da mensagem').setRequired(true))
      )
      .addSubcommand(sub => sub.setName('remover').setDescription('Remove a mensagem fixa deste canal'))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (!guildId || !interaction.guild) return interaction.reply({ content: 'Apenas servidores.', ephemeral: true });

    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ embeds: [createErrorEmbed('Acesso Negado', 'Apenas administradores podem usar comandos `/admin`.')], ephemeral: true });
    }

    if (!group && subcommand === 'setup') {
      await interaction.deferReply({ ephemeral: true });
      const postChannel = interaction.options.getChannel('post-channel');
      const rankingChannel = interaction.options.getChannel('ranking-channel');
      const logChannel = interaction.options.getChannel('log-channel');
      const language = interaction.options.getString('idioma')!;
      const niche = interaction.options.getString('nicho')!;
      const streamerName = interaction.options.getString('streamer-name')!;

      try {
        await prisma.guild.upsert({
          where: { id: guildId },
          update: { name: interaction.guild.name, ownerId: interaction.guild.ownerId },
          create: { id: guildId, name: interaction.guild.name, ownerId: interaction.guild.ownerId }
        });

        await prisma.guildSettings.upsert({
          where: { guildId },
          update: { autoPostChannelId: postChannel?.id, rankingChannelId: rankingChannel?.id, logChannelId: logChannel?.id, language, niche, streamerName },
          create: { guildId, autoPostChannelId: postChannel?.id, rankingChannelId: rankingChannel?.id, logChannelId: logChannel?.id, language, niche, streamerName }
        });

        await interaction.editReply({ embeds: [createSuccessEmbed('Setup Concluído', `Configurações de **${streamerName}** salvas!\n\n- **Canal de Posts**: ${postChannel}\n- **Idioma**: ${language}\n- **Nicho**: ${niche}`)] });
      } catch (error) {
        console.error(error);
        await interaction.editReply({ embeds: [createErrorEmbed('Erro no Setup', 'Ocorreu um erro ao salvar as configurações no banco de dados.')] });
      }
      return;
    }

    if (!group && subcommand === 'plano') {
      await interaction.deferReply({ ephemeral: true });
      try {
        const guild = await prisma.guild.findUnique({ where: { id: guildId }, include: { settings: { include: { plan: true } } } });
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
        await interaction.editReply({ embeds: [createErrorEmbed('Erro ao Carregar', 'Não foi possível carregar os dados do plano.')] });
      }
      return;
    }

    if (!group && subcommand === 'reativar') {
      await interaction.deferReply({ ephemeral: true });
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
          .setFooter({ text: 'Dica da Astra: Agende um post automático para ajudar!' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        await interaction.editReply('❌ Erro ao gerar plano.');
      }
      return;
    }

    if (group === 'relatorio') {
      if (subcommand === 'semanal') {
        const channel = interaction.options.getChannel('canal', true);
        await interaction.deferReply({ ephemeral: true });
        try {
          await prisma.guildSettings.upsert({
            where: { guildId },
            update: { weeklyReportChannelId: channel.id },
            create: { guildId, weeklyReportChannelId: channel.id }
          });
          await interaction.editReply(`✅ Relatório semanal configurado para <#${channel.id}>. (Domingos às 23:59)`);
        } catch (err) {
          await interaction.editReply('❌ Erro ao configurar relatório.');
        }
      }

      if (subcommand === 'gerar') {
        await interaction.deferReply();
        try {
          const topMembers = await prisma.memberActivity.findMany({ where: { guildId }, orderBy: { weeklyMessageCount: 'desc' }, take: 3 });
          const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
          const niche = settings?.niche || 'variedades';
          
          let dicas = 'Mantenha a galera engajada com debates!';
          if (niche === 'games') dicas = 'Que tal um corujão ou campeonato no final de semana?';
          else if (niche === 'anime') dicas = 'Faça uma watchparty de um episódio lançamento!';

          const totalSemana = await prisma.memberActivity.aggregate({ where: { guildId }, _sum: { weeklyMessageCount: true } });
          const activeUsers = await prisma.memberActivity.count({ where: { guildId, weeklyMessageCount: { gt: 0 } } });

          const embed = new EmbedBuilder()
            .setTitle('📊 Relatório de Engajamento da Astra')
            .setColor('#3498db')
            .addFields(
              { name: 'Total na Semana', value: `${totalSemana._sum.weeklyMessageCount || 0} msgs`, inline: true },
              { name: 'Membros Ativos', value: `${activeUsers} ativos`, inline: true },
              { name: '🏆 Top Membros (Semana)', value: topMembers.length > 0 ? topMembers.map((m, i) => `${i + 1}. <@${m.userId}> (${m.weeklyMessageCount})`).join('\n') : 'Sem atividade.' },
              { name: '💡 Sugestão', value: dicas }
            )
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
        } catch (err) {
          await interaction.editReply('❌ Erro ao gerar relatório.');
        }
      }
      return;
    }

    if (group === 'welcome') {
      if (subcommand === "configurar") {
        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.options.getChannel("canal", true);
        const message = interaction.options.getString("mensagem", true);
        const imageUrl = interaction.options.getString("imagem");

        if (!(await checkBotPermissions(interaction, ["ViewChannel", "SendMessages", "EmbedLinks"]))) return;

        await prisma.welcomeMessage.upsert({
          where: { guildId: interaction.guild.id },
          update: { channelId: channel.id, messageText: message, imageUrl },
          create: { guildId: interaction.guild.id, channelId: channel.id, messageText: message, imageUrl },
        });
        await interaction.editReply("✅ Boas-vindas configuradas com sucesso! Use `/admin welcome testar`.");
      }

      if (subcommand === "remover") {
        await interaction.deferReply({ ephemeral: true });
        try {
          await prisma.welcomeMessage.delete({ where: { guildId: interaction.guild.id } });
          await interaction.editReply("✅ Mensagem de boas-vindas removida.");
        } catch (e) {
          await interaction.editReply("❌ Nenhuma mensagem estava configurada.");
        }
      }

      if (subcommand === "testar") {
        await interaction.deferReply();
        const welcome = await prisma.welcomeMessage.findUnique({ where: { guildId: interaction.guild.id } });
        if (!welcome) return interaction.editReply("❌ Nenhuma mensagem configurada.");

        let text = welcome.messageText.replace(/{user}/g, `<@${interaction.user.id}>`).replace(/{server}/g, interaction.guild.name);
        const embed = new EmbedBuilder().setColor("#FF69B4").setDescription(text);
        if (welcome.imageUrl) embed.setImage(welcome.imageUrl);

        await interaction.editReply({ content: "Assim ficará a mensagem:", embeds: [embed] });
      }
      return;
    }

    if (group === 'sticky') {
      if (!interaction.channel) return;
      if (subcommand === "configurar") {
        await interaction.deferReply({ ephemeral: true });
        if (!(await checkBotPermissions(interaction, ["ViewChannel", "SendMessages", "ManageMessages"]))) return;

        const messageText = interaction.options.getString("mensagem", true);
        await prisma.stickyMessage.upsert({
          where: { guildId_channelId: { guildId: interaction.guild.id, channelId: interaction.channel.id } },
          update: { messageText, active: true },
          create: { guildId: interaction.guild.id, channelId: interaction.channel.id, messageText },
        });

        await interaction.editReply("✅ Sticky Message configurada para este canal!");
        
        const embed = new EmbedBuilder().setColor("#FFFF00").setDescription(`📌 **Mensagem Fixada:**\n${messageText}`);
        if (!('send' in interaction.channel)) return;
        const msg = await interaction.channel.send({ embeds: [embed] });
        
        await prisma.stickyMessage.update({
          where: { guildId_channelId: { guildId: interaction.guild.id, channelId: interaction.channel.id } },
          data: { lastMessageId: msg.id }
        });
      }

      if (subcommand === "remover") {
        await interaction.deferReply({ ephemeral: true });
        try {
          await prisma.stickyMessage.delete({
            where: { guildId_channelId: { guildId: interaction.guild.id, channelId: interaction.channel.id } },
          });
          await interaction.editReply("✅ Sticky Message removida.");
        } catch (e) {
          await interaction.editReply("❌ Nenhuma fixa neste canal.");
        }
      }
      return;
    }
  },
};
