import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from 'discord.js';
import { prisma } from '@astra/db';
import { compileEmbed, DEFAULT_TEMPLATES } from '../utils/embedCompiler';
import { isAstraAdmin } from '../utils/permissions';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds';

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Gerencia os templates de embed customizados do servidor.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    
    // MODELOS
    .addSubcommand(sub => sub.setName('modelos').setDescription('Lista todos os modelos de embed disponíveis'))
    
    // TESTAR
    .addSubcommand(sub => sub.setName('testar').setDescription('Envia um teste de como o embed vai ficar na tela')
      .addStringOption(opt => opt.setName('template').setDescription('Qual template testar?').setRequired(true).addChoices(
        ...Object.keys(DEFAULT_TEMPLATES).map(k => ({ name: k, value: k }))
      ))
      .addChannelOption(opt => opt.setName('canal').setDescription('Canal para enviar o teste (opcional)').addChannelTypes(ChannelType.GuildText))
    )
    
    // RESETAR
    .addSubcommand(sub => sub.setName('resetar').setDescription('Restaura um template para o Padrão de Fábrica')
      .addStringOption(opt => opt.setName('template').setDescription('Qual template resetar?').setRequired(true).addChoices(
        ...Object.keys(DEFAULT_TEMPLATES).map(k => ({ name: k, value: k }))
      ))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (!guildId) return interaction.reply({ content: 'Apenas servidores.', ephemeral: true });

    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ embeds: [createErrorEmbed('Acesso Negado', 'Apenas administradores podem usar comandos `/embed`.')], ephemeral: true });
    }

    if (subcommand === 'modelos') {
      await interaction.deferReply({ ephemeral: true });
      const customTemplates = await prisma.customEmbedTemplate.findMany({ where: { guildId } });
      const customKeys = customTemplates.map(t => t.templateKey);

      let text = 'Aqui estão os templates disponíveis:\n\n';
      for (const key of Object.keys(DEFAULT_TEMPLATES)) {
        if (customKeys.includes(key)) {
          text += `✅ **${key}** (Customizado)\n`;
        } else {
          text += `⚪ **${key}** (Padrão da Astra)\n`;
        }
      }
      
      text += '\n*Acesse o Dashboard Web para editar o visual de cada um deles!*';

      await interaction.editReply({ embeds: [createSuccessEmbed('Modelos de Embed', text)] });
      return;
    }

    if (subcommand === 'testar') {
      await interaction.deferReply({ ephemeral: true });
      const templateKey = interaction.options.getString('template', true);
      const channel = interaction.options.getChannel('canal') || interaction.channel;

      const dummyVariables = {
        user: `<@${interaction.user.id}>`,
        username: interaction.user.username,
        server: interaction.guild?.name || 'Seu Servidor',
        memberCount: interaction.guild?.memberCount.toString() || '100',
        creator: 'Felipe',
        liveTitle: 'Jogando o Lançamento do Ano!',
        liveUrl: 'https://twitch.tv/hauntedtalesx',
        youtubeTitle: 'React ao Novo Trailer!',
        youtubeUrl: 'https://youtube.com/watch?v=123',
        rankingTop1: `<@${interaction.user.id}>`,
        level: '15',
        xp: '1450',
        coins: '500',
        pet: 'Nebulinha',
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR'),
      };

      try {
        const compiled = await compileEmbed(guildId, templateKey, dummyVariables);
        
        if (channel && 'send' in channel) {
           await channel.send(compiled);
           await interaction.editReply({ embeds: [createSuccessEmbed('Teste Enviado', `O template **${templateKey}** foi enviado com sucesso em <#${channel.id}>.`)] });
        } else {
           await interaction.editReply(compiled);
        }

        // Add AuditLog
        await prisma.auditLog.create({
          data: {
            guildId,
            action: 'EMBED_TEMPLATE_TESTED',
            details: `Usuário testou o template ${templateKey}.`,
            performedBy: interaction.user.id,
          }
        });

      } catch (err) {
        console.error(err);
        await interaction.editReply({ embeds: [createErrorEmbed('Erro', 'Ocorreu um erro ao compilar e enviar o embed de teste.')] });
      }
      return;
    }

    if (subcommand === 'resetar') {
      await interaction.deferReply({ ephemeral: true });
      const templateKey = interaction.options.getString('template', true);

      try {
        await prisma.customEmbedTemplate.delete({
          where: { guildId_templateKey: { guildId, templateKey } }
        });

        // Add AuditLog
        await prisma.auditLog.create({
          data: {
            guildId,
            action: 'EMBED_TEMPLATE_RESET',
            details: `Template ${templateKey} foi resetado para o padrão de fábrica.`,
            performedBy: interaction.user.id,
          }
        });

        await interaction.editReply({ embeds: [createSuccessEmbed('Reset Concluído', `O template **${templateKey}** voltou para as configurações originais da Astra.`)] });
      } catch (err) {
        // Ignorar se já não existia
        await interaction.editReply({ embeds: [createSuccessEmbed('Reset Concluído', `O template **${templateKey}** já estava usando as configurações originais da Astra.`)] });
      }
      return;
    }
  },
};
