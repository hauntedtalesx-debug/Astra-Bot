import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { prisma } from "@astra/db";
import { checkCooldown } from "../utils/cooldown";
import { isAstraAdmin } from "../utils/permissions";
import { isLimitReached } from "../utils/limits";
import { logAudit, AuditLogAction } from "../utils/audit";

export default {
  data: new SlashCommandBuilder()
    .setName("shorts")
    .setDescription("Ferramenta criativa para ideias de Shorts e TikTok")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ideia")
        .setDescription("A Astra gera uma ideia aleatória para o seu nicho")
        .addStringOption((option) => option.setName("tema").setDescription("Tema base opcional").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("salvar")
        .setDescription("Salva uma ideia que você teve na sua biblioteca")
        .addStringOption((option) => option.setName("titulo").setDescription("Título da ideia").setRequired(true))
        .addStringOption((option) => option.setName("gancho").setDescription("A primeira frase do vídeo (o gancho)").setRequired(true))
        .addStringOption((option) => option.setName("roteiro").setDescription("Resumo do que gravar").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("listar").setDescription("Lista suas ideias de shorts salvas")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ content: "❌ Apenas administradores podem usar este comando.", ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "ideia") {
      const cooldown = checkCooldown("shorts-ideia", interaction.guild.id, 10000);
      if (cooldown.onCooldown) {
        return interaction.reply({ content: `⏱️ Aguarde ${Math.ceil(cooldown.timeLeft! / 1000)}s para pedir outra ideia.`, ephemeral: true });
      }

      await interaction.deferReply();
      const settings = await prisma.guildSettings.findUnique({ where: { guildId: interaction.guild.id } });
      const niche = settings?.niche || "variedades";

      // Mock generation based on niche
      const embed = new EmbedBuilder()
        .setTitle("📱 Ideia de Conteúdo Curto")
        .setColor("#FF0050")
        .addFields(
          { name: "🎯 Nicho", value: niche, inline: true },
          { name: "🪝 Gancho Forte", value: `"Eu tentei ${niche === "games" ? "farmar por 1 hora" : "aplicar esse truque simples"} e você não vai acreditar no que aconteceu..."` },
          { name: "📜 Roteiro Base", value: "1. Mostre sua frustração inicial.\n2. Mostre a técnica que você usou.\n3. Revele o resultado final na tela.\n4. CTA: Peça para comentarem se já passaram por isso." }
        )
        .setFooter({ text: "Use /shorts salvar para guardar esta ideia no banco de dados." });

      await interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === "salvar") {
      await interaction.deferReply({ ephemeral: true });

      const isFull = await isLimitReached(interaction.guild.id, "maxShorts", async () => {
        return await prisma.shortIdea.count({ where: { guildId: interaction.guild!.id } });
      });

      if (isFull) {
        return interaction.editReply("❌ **Limite Alcançado!** Apague ideias antigas ou assine um plano maior para salvar mais roteiros.");
      }

      const titulo = interaction.options.getString("titulo", true);
      const gancho = interaction.options.getString("gancho", true);
      const roteiro = interaction.options.getString("roteiro", true);
      const settings = await prisma.guildSettings.findUnique({ where: { guildId: interaction.guild.id } });

      const idea = await prisma.shortIdea.create({
        data: {
          guildId: interaction.guild.id,
          createdBy: interaction.user.id,
          title: titulo,
          hook: gancho,
          script: roteiro,
          niche: settings?.niche || "variedades",
        },
      });

      await logAudit(interaction.guild.id, interaction.user.id, AuditLogAction.SHORT_IDEA_SAVED, { title: titulo });
      await interaction.editReply(`✅ Ideia de Short salva com sucesso! ID: \`${idea.id}\``);
    }

    if (subcommand === "listar") {
      await interaction.deferReply({ ephemeral: true });

      const ideas = await prisma.shortIdea.findMany({
        where: { guildId: interaction.guild.id, status: "SAVED" },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      if (ideas.length === 0) {
        return interaction.editReply("Nenhuma ideia salva ainda. Use `/shorts ideia` para gerar alguma!");
      }

      const embed = new EmbedBuilder()
        .setTitle("📱 Suas Ideias Salvas (Top 5)")
        .setColor("#FF0050")
        .setDescription(
          ideas
            .map((i) => `**ID:** \`${i.id}\` | **${i.title}**\n*Gancho:* ${i.hook}\n*Roteiro:* ${i.script}`)
            .join("\n\n---\n\n")
        );

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
