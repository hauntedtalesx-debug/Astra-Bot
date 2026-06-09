import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, TextChannel } from 'discord.js';
import { prisma } from '@astra/db';
import { checkBotPermissions, isAstraAdmin } from '../utils/permissions';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Gerencia o sistema de tickets da Astra.')
    .addSubcommand(subcmd => 
      subcmd.setName('painel')
        .setDescription('Envia o painel de tickets neste canal.')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (!guildId) return interaction.reply({ content: 'Apenas para servidores.', ephemeral: true });

    if (subcommand === 'painel') {
      const channel = interaction.channel;
      if (!channel || !('send' in channel)) return;

      const member = interaction.guild?.members.cache.get(interaction.user.id);
      if (!member) return;
      
      const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
      if (!(await isAstraAdmin(member, settings?.astraAdminRoleId))) {
        return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
      }

      const hasPerms = await checkBotPermissions(interaction, [
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ManageChannels // Necessário para criar canais
      ]);
      if (!hasPerms) return;

      const embed = new EmbedBuilder()
        .setTitle("🎫 Central de Atendimento")
        .setDescription("Precisa de ajuda? Clique no botão abaixo para abrir um ticket privado com a nossa equipe.")
        .setColor("#00BFFF");

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("ticket_open")
          .setLabel("Abrir Ticket")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🎫")
      );

      await channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: 'Painel de tickets enviado com sucesso!', ephemeral: true });
    }
  },
};
