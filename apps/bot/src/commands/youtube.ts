import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { prisma } from "@astra/db";
import { checkCooldown } from "../utils/cooldown";
import { checkBotPermissions, isAstraAdmin } from "../utils/permissions";
import { isLimitReached } from "../utils/limits";
import { logAudit, AuditLogAction } from "../utils/audit";

export default {
  data: new SlashCommandBuilder()
    .setName("youtube")
    .setDescription("Gerencia alertas de vídeos novos no YouTube")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("conectar")
        .setDescription("Conecta um canal do YouTube para receber vídeos novos")
        .addStringOption((option) =>
          option.setName("id_ou_nome").setDescription("ID do canal ou nome").setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("canal")
            .setDescription("Canal do Discord para envio")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option.setName("mencionar").setDescription("Cargo para mencionar").setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("status").setDescription("Lista canais conectados")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("testar").setDescription("Simula um vídeo novo")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remover")
        .setDescription("Remove um alerta configurado")
        .addStringOption((option) =>
          option.setName("id").setDescription("ID do alerta (veja no /youtube status)").setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ content: "❌ Apenas administradores podem usar este comando.", ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "conectar") {
      await interaction.deferReply({ ephemeral: true });

      const targetChannel = interaction.options.getChannel("canal");
      if (targetChannel && !(await checkBotPermissions(interaction, ["ViewChannel", "SendMessages", "EmbedLinks"]))) {
        return;
      }

      const isFull = await isLimitReached(interaction.guild.id, "maxYoutube", async () => {
        return await prisma.youtubeIntegration.count({ where: { guildId: interaction.guild!.id } });
      });

      if (isFull) {
        return interaction.editReply("❌ **Limite de Plano Alcançado!** Você já atingiu o máximo de canais do YouTube permitidos no seu plano.");
      }

      const youtubeInput = interaction.options.getString("id_ou_nome", true);
      const mentionRole = interaction.options.getRole("mencionar");

      try {
        const integration = await prisma.youtubeIntegration.create({
          data: {
            guildId: interaction.guild.id,
            youtubeChannelId: youtubeInput,
            youtubeChannelName: youtubeInput,
            discordChannelId: targetChannel!.id,
            mentionRoleId: mentionRole?.id,
          },
        });

        await logAudit(interaction.guild.id, interaction.user.id, AuditLogAction.YOUTUBE_CONNECTED, { youtubeInput });
        await interaction.editReply(`✅ Canal **${youtubeInput}** conectado com sucesso!\nID: \`${integration.id}\``);
      } catch (error: any) {
        if (error.code === "P2002") {
          return interaction.editReply("❌ Este canal do YouTube já está conectado.");
        }
        return interaction.editReply("❌ Ocorreu um erro ao conectar.");
      }
    }

    if (subcommand === "status") {
      await interaction.deferReply({ ephemeral: true });
      const integrations = await prisma.youtubeIntegration.findMany({ where: { guildId: interaction.guild.id } });

      if (integrations.length === 0) {
        return interaction.editReply("Nenhum canal do YouTube conectado.");
      }

      const embed = new EmbedBuilder()
        .setTitle("📺 Status do YouTube")
        .setColor("#FF0000")
        .setDescription(
          integrations
            .map((i) => `**ID:** \`${i.id}\`\n**Canal:** ${i.youtubeChannelName}\n**Aviso em:** <#${i.discordChannelId}>`)
            .join("\n\n")
        );

      await interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === "remover") {
      await interaction.deferReply({ ephemeral: true });
      const id = interaction.options.getString("id", true);

      try {
        const deleted = await prisma.youtubeIntegration.delete({
          where: { id, guildId: interaction.guild.id },
        });
        await logAudit(interaction.guild.id, interaction.user.id, AuditLogAction.YOUTUBE_REMOVED, { channel: deleted.youtubeChannelName });
        await interaction.editReply("✅ Alerta do YouTube removido com sucesso!");
      } catch (e) {
        await interaction.editReply("❌ Não foi possível encontrar este ID ou removê-lo.");
      }
    }

    if (subcommand === "testar") {
      const cooldown = checkCooldown("youtube-testar", interaction.guild.id, 10000);
      if (cooldown.onCooldown) {
        return interaction.reply({ content: `⏱️ Aguarde ${Math.ceil(cooldown.timeLeft! / 1000)}s para testar novamente.`, ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle("🎬 Novo vídeo no canal!")
        .setDescription("**Astra - Como Configurar o Bot Perfeito para Streamers**\n\nDepois de assistir, volta aqui e comenta: *Qual foi a melhor parte do vídeo?*")
        .setColor("#FF0000")
        .setURL("https://youtube.com")
        .setImage("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop");

      await interaction.reply({
        content: "👋 <@&000000000>",
        embeds: [embed],
      });
    }
  },
};
