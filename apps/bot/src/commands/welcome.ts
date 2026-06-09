import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { prisma } from "@astra/db";
import { isAstraAdmin, checkBotPermissions } from "../utils/permissions";

export default {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Configura mensagens personalizadas de boas-vindas")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("configurar")
        .setDescription("Ativa ou atualiza as boas-vindas do servidor")
        .addChannelOption((option) =>
          option
            .setName("canal")
            .setDescription("Canal onde a mensagem será enviada")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("mensagem")
            .setDescription("Use {user} para mencionar e {server} para o nome do servidor")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("imagem").setDescription("URL de uma imagem (opcional)").setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("remover").setDescription("Desativa as boas-vindas automáticas")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("testar").setDescription("Simula como a mensagem vai aparecer")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ content: "❌ Apenas administradores podem usar este comando.", ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "configurar") {
      await interaction.deferReply({ ephemeral: true });

      const channel = interaction.options.getChannel("canal", true);
      const message = interaction.options.getString("mensagem", true);
      const imageUrl = interaction.options.getString("imagem");

      if (!(await checkBotPermissions(interaction, ["ViewChannel", "SendMessages", "EmbedLinks"]))) {
        return;
      }

      await prisma.welcomeMessage.upsert({
        where: { guildId: interaction.guild.id },
        update: { channelId: channel.id, messageText: message, imageUrl },
        create: { guildId: interaction.guild.id, channelId: channel.id, messageText: message, imageUrl },
      });

      await interaction.editReply("✅ Boas-vindas configuradas com sucesso! Use `/welcome testar` para visualizar.");
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

      if (!welcome) {
        return interaction.editReply("❌ Nenhuma mensagem configurada. Use `/welcome configurar` primeiro.");
      }

      let text = welcome.messageText
        .replace(/{user}/g, `<@${interaction.user.id}>`)
        .replace(/{server}/g, interaction.guild.name);

      const embed = new EmbedBuilder()
        .setColor("#FF69B4")
        .setDescription(text);

      if (welcome.imageUrl) {
        embed.setImage(welcome.imageUrl);
      }

      await interaction.editReply({ content: "Assim ficará a mensagem de boas-vindas:", embeds: [embed] });
    }
  },
};
