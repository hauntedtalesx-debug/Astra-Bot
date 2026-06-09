import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { prisma } from "@astra/db";
import { isAstraAdmin, checkBotPermissions } from "../utils/permissions";

export default {
  data: new SlashCommandBuilder()
    .setName("sticky")
    .setDescription("Gerencia mensagens fixadas na parte inferior do chat")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("configurar")
        .setDescription("Define a mensagem fixa para este canal")
        .addStringOption((option) => option.setName("mensagem").setDescription("Texto da mensagem").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("remover").setDescription("Remove a mensagem fixa deste canal")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild || !interaction.channel) return;

    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ content: "❌ Apenas administradores podem usar este comando.", ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "configurar") {
      await interaction.deferReply({ ephemeral: true });

      if (!(await checkBotPermissions(interaction, ["ViewChannel", "SendMessages", "ManageMessages"]))) {
        return;
      }

      const messageText = interaction.options.getString("mensagem", true);

      await prisma.stickyMessage.upsert({
        where: { guildId_channelId: { guildId: interaction.guild.id, channelId: interaction.channel.id } },
        update: { messageText, active: true },
        create: { guildId: interaction.guild.id, channelId: interaction.channel.id, messageText },
      });

      await interaction.editReply("✅ Sticky Message configurada para este canal!");
      
      const embed = new EmbedBuilder()
        .setColor("#FFFF00")
        .setDescription(`📌 **Mensagem Fixada:**\n${messageText}`);
        
      if (!interaction.channel || !('send' in interaction.channel)) return;
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
        await interaction.editReply("✅ Sticky Message removida deste canal.");
      } catch (e) {
        await interaction.editReply("❌ Nenhuma mensagem fixa configurada neste canal.");
      }
    }
  },
};
