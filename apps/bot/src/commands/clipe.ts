import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { prisma } from "@astra/db";
import { checkCooldown } from "../utils/cooldown";
import { isAstraAdmin, checkBotPermissions } from "../utils/permissions";
import { isLimitReached } from "../utils/limits";
import { logAudit, AuditLogAction } from "../utils/audit";

export default {
  data: new SlashCommandBuilder()
    .setName("clipe")
    .setDescription("Gerencia o envio e curadoria de clipes da live")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enviar")
        .setDescription("Envia um clipe da live para o streamer ver")
        .addStringOption((option) =>
          option.setName("url").setDescription("Link do clipe (Twitch, Kick, YouTube)").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("descricao").setDescription("Me conta o que acontece nesse clipe!").setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("configurar")
        .setDescription("[Admin] Configura os canais do sistema de clipes")
        .addChannelOption((option) =>
          option.setName("canal_aprovados").setDescription("Canal onde clipes aprovados aparecerão").addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("listar")
        .setDescription("[Admin] Lista clipes enviados pela comunidade")
        .addStringOption((option) =>
          option
            .setName("status")
            .setDescription("Filtra por status")
            .addChoices(
              { name: "Pendentes", value: "PENDING" },
              { name: "Aprovados", value: "APPROVED" },
              { name: "Rejeitados", value: "REJECTED" },
              { name: "Destaques", value: "FEATURED" }
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("aprovar")
        .setDescription("[Admin] Aprova um clipe e posta no canal de aprovados")
        .addStringOption((option) => option.setName("id").setDescription("ID do clipe").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rejeitar")
        .setDescription("[Admin] Rejeita um clipe ruim")
        .addStringOption((option) => option.setName("id").setDescription("ID do clipe").setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const subcommand = interaction.options.getSubcommand();
    const isAdmin = await isAstraAdmin(interaction.member as any);

    if (subcommand === "enviar") {
      await interaction.deferReply({ ephemeral: true });

      const url = interaction.options.getString("url", true);
      const description = interaction.options.getString("descricao");

      // Verify Limits
      const isFull = await isLimitReached(interaction.guild.id, "maxClips", async () => {
        return await prisma.clipSubmission.count({ where: { guildId: interaction.guild!.id } });
      });

      if (isFull) {
        return interaction.editReply("❌ O banco de clipes do servidor está cheio! O administrador precisa assinar um plano maior ou apagar clipes antigos.");
      }

      // Prevenir Spam
      const cooldown = checkCooldown(`clipe-enviar`, interaction.user.id, 60000);
      if (cooldown.onCooldown) {
        return interaction.editReply(`⏱️ Calma aí! Aguarde ${Math.ceil(cooldown.timeLeft! / 1000)}s para enviar outro clipe.`);
      }

      const clipe = await prisma.clipSubmission.create({
        data: {
          guildId: interaction.guild.id,
          userId: interaction.user.id,
          username: interaction.user.username,
          url,
          description,
        },
      });

      await interaction.editReply(`✅ Clipe enviado com sucesso! O streamer vai avaliar em breve.\nID: \`${clipe.id}\``);
    }

    if (subcommand === "configurar") {
      if (!isAdmin) return interaction.reply({ content: "❌ Comando apenas para admins.", ephemeral: true });
      await interaction.deferReply({ ephemeral: true });

      const approvedChannel = interaction.options.getChannel("canal_aprovados", true);

      await prisma.clipSettings.upsert({
        where: { guildId: interaction.guild.id },
        update: { approvedChannelId: approvedChannel.id },
        create: { guildId: interaction.guild.id, approvedChannelId: approvedChannel.id },
      });

      await logAudit(interaction.guild.id, interaction.user.id, AuditLogAction.CLIP_SETTINGS_UPDATED, { approvedChannelId: approvedChannel.id });

      await interaction.editReply("✅ Canal de clipes aprovados configurado com sucesso!");
    }

    if (subcommand === "listar") {
      if (!isAdmin) return interaction.reply({ content: "❌ Comando apenas para admins.", ephemeral: true });
      await interaction.deferReply({ ephemeral: true });

      const status = interaction.options.getString("status", true);
      const clipes = await prisma.clipSubmission.findMany({
        where: { guildId: interaction.guild.id, status },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      if (clipes.length === 0) {
        return interaction.editReply(`Nenhum clipe com status **${status}** encontrado.`);
      }

      const embed = new EmbedBuilder()
        .setTitle(`🎬 Últimos 10 Clipes - ${status}`)
        .setColor("#FF4500")
        .setDescription(
          clipes
            .map((c) => `**ID:** \`${c.id}\` | **Por:** @${c.username}\n**URL:** ${c.url}\n${c.description ? `*${c.description}*` : ""}`)
            .join("\n\n")
        );

      await interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === "aprovar") {
      if (!isAdmin) return interaction.reply({ content: "❌ Comando apenas para admins.", ephemeral: true });
      await interaction.deferReply({ ephemeral: true });

      const id = interaction.options.getString("id", true);
      const settings = await prisma.clipSettings.findUnique({ where: { guildId: interaction.guild.id } });

      if (!settings?.approvedChannelId) {
        return interaction.editReply("❌ Você precisa rodar o `/clipe configurar` primeiro para escolher o canal de aprovados.");
      }

      const clipe = await prisma.clipSubmission.findUnique({ where: { id, guildId: interaction.guild.id } });

      if (!clipe) {
        return interaction.editReply("❌ Clipe não encontrado.");
      }

      await prisma.clipSubmission.update({
        where: { id },
        data: { status: "APPROVED", reviewedBy: interaction.user.id },
      });

      const channel = interaction.guild.channels.cache.get(settings.approvedChannelId);
      if (channel && channel.isTextBased()) {
        if (!(await checkBotPermissions(interaction, ["ViewChannel", "SendMessages"]))) return;

        const embed = new EmbedBuilder()
          .setTitle("🎬 Novo Clipe Aprovado!")
          .setColor("#00FF00")
          .setDescription(`Clipe enviado por <@${clipe.userId}>\n\n**Assista:** ${clipe.url}\n${clipe.description ? `*${clipe.description}*` : ""}`);

        await channel.send({ embeds: [embed] });
      }

      await logAudit(interaction.guild.id, interaction.user.id, AuditLogAction.CLIP_APPROVED, { clipId: id });
      await interaction.editReply("✅ Clipe aprovado e postado no canal configurado!");
    }

    if (subcommand === "rejeitar") {
      if (!isAdmin) return interaction.reply({ content: "❌ Comando apenas para admins.", ephemeral: true });
      await interaction.deferReply({ ephemeral: true });

      const id = interaction.options.getString("id", true);

      try {
        await prisma.clipSubmission.update({
          where: { id, guildId: interaction.guild.id },
          data: { status: "REJECTED", reviewedBy: interaction.user.id },
        });

        await logAudit(interaction.guild.id, interaction.user.id, AuditLogAction.CLIP_REJECTED, { clipId: id });
        await interaction.editReply("✅ Clipe rejeitado e ocultado.");
      } catch (e) {
        await interaction.editReply("❌ Clipe não encontrado.");
      }
    }
  },
};
