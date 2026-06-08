import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, ChannelType } from 'discord.js';
import { prisma } from '@astra/db';

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configuração inicial do Astra no servidor.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addChannelOption(option => 
      option.setName('post-channel')
        .setDescription('Canal para posts automáticos')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .addChannelOption(option => 
      option.setName('ranking-channel')
        .setDescription('Canal para exibir o ranking')
        .addChannelTypes(ChannelType.GuildText))
    .addChannelOption(option => 
      option.setName('log-channel')
        .setDescription('Canal para logs internos')
        .addChannelTypes(ChannelType.GuildText))
    .addStringOption(option =>
      option.setName('idioma')
        .setDescription('Idioma do bot (pt-BR ou en-US)')
        .setRequired(true)
        .addChoices(
          { name: 'Português (BR)', value: 'pt-BR' },
          { name: 'English (US)', value: 'en-US' },
          { name: 'Español (ES)', value: 'es-ES' },
          { name: 'Français (FR)', value: 'fr-FR' },
          { name: '日本語 (JP)', value: 'ja-JP' }
        ))
    .addStringOption(option =>
      option.setName('nicho')
        .setDescription('Nicho da comunidade')
        .setRequired(true)
        .addChoices(
          { name: 'Games', value: 'games' },
          { name: 'Anime', value: 'anime' },
          { name: 'Tecnologia', value: 'tech' },
          { name: 'Variedades', value: 'variedades' }
        ))
    .addStringOption(option =>
      option.setName('streamer-name')
        .setDescription('Nome do streamer/criador')
        .setRequired(true)),
        
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guildId;
    if (!guildId) return interaction.editReply('Erro: Comando apenas para servidores.');

    const postChannel = interaction.options.getChannel('post-channel');
    const rankingChannel = interaction.options.getChannel('ranking-channel');
    const logChannel = interaction.options.getChannel('log-channel');
    const language = interaction.options.getString('idioma')!;
    const niche = interaction.options.getString('nicho')!;
    const streamerName = interaction.options.getString('streamer-name')!;

    try {
      // Upsert guild first
      await prisma.guild.upsert({
        where: { id: guildId },
        update: {
          name: interaction.guild?.name || 'Servidor Desconhecido',
          ownerId: interaction.guild?.ownerId || '',
        },
        create: {
          id: guildId,
          name: interaction.guild?.name || 'Servidor Desconhecido',
          ownerId: interaction.guild?.ownerId || '',
        }
      });

      // Upsert Settings
      await prisma.guildSettings.upsert({
        where: { guildId },
        update: {
          autoPostChannelId: postChannel?.id,
          rankingChannelId: rankingChannel?.id,
          logChannelId: logChannel?.id,
          language,
          niche,
          streamerName
        },
        create: {
          guildId,
          autoPostChannelId: postChannel?.id,
          rankingChannelId: rankingChannel?.id,
          logChannelId: logChannel?.id,
          language,
          niche,
          streamerName
        }
      });

      await interaction.editReply(`✅ Setup concluído com sucesso para **${streamerName}**!\n- Canal de Posts: ${postChannel}\n- Idioma: ${language}\n- Nicho: ${niche}`);
      
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Ocorreu um erro ao salvar as configurações no banco de dados.');
    }
  },
};
