import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { prisma } from "@astra/db";
import { checkCooldown } from "../utils/cooldown";
import { checkBotPermissions, isAstraAdmin } from "../utils/permissions";
import { isLimitReached } from "../utils/limits";
import { logAudit, AuditLogAction } from "../utils/audit";

export default {
  data: new SlashCommandBuilder()
    .setName("live")
    .setDescription("Gerencia alertas de live da Twitch, YouTube ou Kick")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("conectar")
        .setDescription("Conecta um novo canal para alertas automáticos")
        .addStringOption((option) =>
          option
            .setName("plataforma")
            .setDescription("Plataforma da live")
            .setRequired(true)
            .addChoices(
              { name: "Twitch", value: "twitch" },
              { name: "YouTube", value: "youtube" },
              { name: "Kick", value: "kick" }
            )
        )
        .addStringOption((option) =>
          option.setName("username").setDescription("Nome de usuário ou ID do canal").setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("canal")
            .setDescription("Canal do Discord onde o alerta será enviado")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option.setName("mencionar").setDescription("Cargo para mencionar quando a live começar").setRequired(false)
        )
        .addStringOption((option) =>
          option.setName("mensagem").setDescription("Mensagem customizada do aviso").setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("status").setDescription("Mostra todas as lives conectadas neste servidor")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("testar").setDescription("Simula um anúncio de live no canal atual para ver como fica")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remover")
        .setDescription("Remove um alerta de live configurado")
        .addStringOption((option) =>
          option.setName("id").setDescription("ID da integração (veja no /live status)").setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    // Apenas Admins
    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ content: "❌ Apenas administradores podem usar este comando.", ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "conectar") {
      await interaction.deferReply({ ephemeral: true });

      // Verificar permissões no canal alvo
      const targetChannel = interaction.options.getChannel("canal");
      if (targetChannel && !(await checkBotPermissions(interaction, ["ViewChannel", "SendMessages", "EmbedLinks"]))) {
        return; // checkBotPermissions already replies
      }

      // Check Plan Limits
      const isFull = await isLimitReached(interaction.guild.id, "maxLives", async () => {
        return await prisma.creatorIntegration.count({ where: { guildId: interaction.guild!.id } });
      });

      if (isFull) {
        return interaction.editReply("❌ **Limite de Plano Alcançado!** Você já conectou o máximo de lives que seu plano atual permite. Faça um upgrade no painel para adicionar mais.");
      }

      const platform = interaction.options.getString("plataforma", true);
      const username = interaction.options.getString("username", true);
      const mentionRole = interaction.options.getRole("mencionar");
      const customMessage = interaction.options.getString("mensagem");

      try {
        const integration = await prisma.creatorIntegration.create({
          data: {
            guildId: interaction.guild.id,
            platform,
            creatorUsername: username,
            discordChannelId: targetChannel!.id,
            mentionRoleId: mentionRole?.id,
            customMessage,
          },
        });

        await logAudit(interaction.guild.id, interaction.user.id, AuditLogAction.LIVE_CONNECTED, { platform, username });

        await interaction.editReply(`✅ Canal **${username}** (${platform}) conectado com sucesso!\nID: \`${integration.id}\``);
      } catch (error: any) {
        if (error.code === "P2002") {
          return interaction.editReply("❌ Este canal já está conectado nesta plataforma.");
        }
        console.error(error);
        return interaction.editReply("❌ Ocorreu um erro ao conectar a live.");
      }
    }

    if (subcommand === "status") {
      await interaction.deferReply({ ephemeral: true });
      const integrations = await prisma.creatorIntegration.findMany({ where: { guildId: interaction.guild.id } });

      if (integrations.length === 0) {
        return interaction.editReply("Nenhuma live conectada no momento.");
      }

      const embed = new EmbedBuilder()
        .setTitle("📡 Status de Conexões de Live")
        .setColor("#8a2be2")
        .setDescription(
          integrations
            .map((i) => `**ID:** \`${i.id}\`\n**Canal:** ${i.creatorUsername} (${i.platform})\n**Aviso em:** <#${i.discordChannelId}>`)
            .join("\n\n")
        );

      await interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === "remover") {
      await interaction.deferReply({ ephemeral: true });
      const id = interaction.options.getString("id", true);

      try {
        const deleted = await prisma.creatorIntegration.delete({
          where: { id, guildId: interaction.guild.id },
        });
        await logAudit(interaction.guild.id, interaction.user.id, AuditLogAction.LIVE_REMOVED, { platform: deleted.platform, username: deleted.creatorUsername });
        await interaction.editReply("✅ Alerta de live removido com sucesso!");
      } catch (e) {
        await interaction.editReply("❌ Não foi possível encontrar este ID ou removê-lo.");
      }
    }

    if (subcommand === "testar") {
      const cooldown = checkCooldown("live-testar", interaction.guild.id, 10000); // 10 seconds per guild
      if (cooldown.onCooldown) {
        return interaction.reply({ content: `⏱️ Aguarde ${Math.ceil(cooldown.timeLeft! / 1000)}s para testar novamente.`, ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle("🔴 astra_bot está ao vivo!")
        .setDescription("A Astra acabou de ligar a live na Twitch e está codando novos recursos!\n\n**Categoria:** Software and Game Development\n**Plataforma:** Twitch")
        .setColor("#9146FF")
        .setURL("https://twitch.tv/astra_bot")
        .setThumbnail("https://api.dicebear.com/7.x/bottts/png?seed=astra");

      await interaction.reply({
        content: "👋 Exemplo de mensagem configurada! <@&000000000>",
        embeds: [embed],
      });
    }
  },
};
