import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { prisma } from "@astra/db";
import { isAstraAdmin } from "../utils/permissions";

export default {
  data: new SlashCommandBuilder()
    .setName("missoes")
    .setDescription("Gerencia missões para engajar a comunidade")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("criar")
        .setDescription("[Admin] Cria uma nova missão")
        .addStringOption((option) => option.setName("titulo").setDescription("Título da missão").setRequired(true))
        .addStringOption((option) => option.setName("descricao").setDescription("O que os membros precisam fazer?").setRequired(true))
        .addIntegerOption((option) => option.setName("pontos").setDescription("Pontos que vale no ranking").setRequired(true))
        .addStringOption((option) => option.setName("recompensa").setDescription("Recompensa extra opcional").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remover")
        .setDescription("[Admin] Remove uma missão ativa")
        .addStringOption((option) => option.setName("id").setDescription("ID da missão").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("listar").setDescription("Mostra todas as missões ativas")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const subcommand = interaction.options.getSubcommand();
    const isAdmin = await isAstraAdmin(interaction.member as any);

    if (subcommand === "criar") {
      if (!isAdmin) return interaction.reply({ content: "❌ Comando apenas para admins.", ephemeral: true });
      await interaction.deferReply({ ephemeral: true });

      const title = interaction.options.getString("titulo", true);
      const description = interaction.options.getString("descricao", true);
      const points = interaction.options.getInteger("pontos", true);
      const reward = interaction.options.getString("recompensa");

      const mission = await prisma.communityMission.create({
        data: {
          guildId: interaction.guild.id,
          title,
          description,
          points,
          reward,
        },
      });

      await interaction.editReply(`✅ Missão criada com sucesso!\nID: \`${mission.id}\``);

      // Opcional: enviar aviso no chat geral se o Admin estiver nele
      const channel = interaction.channel;
      if (channel && 'send' in channel) {
        const embed = new EmbedBuilder()
          .setTitle(`🎯 Nova Missão: ${title}`)
          .setColor("#FFD700")
          .setDescription(description)
          .addFields({ name: "🏆 Recompensa", value: `${points} pontos no ranking${reward ? ` + ${reward}` : ""}` });

        await channel.send({ embeds: [embed] });
      }
    }

    if (subcommand === "remover") {
      if (!isAdmin) return interaction.reply({ content: "❌ Comando apenas para admins.", ephemeral: true });
      await interaction.deferReply({ ephemeral: true });

      const id = interaction.options.getString("id", true);

      try {
        await prisma.communityMission.delete({
          where: { id, guildId: interaction.guild.id },
        });
        await interaction.editReply("✅ Missão removida com sucesso.");
      } catch (e) {
        await interaction.editReply("❌ Missão não encontrada.");
      }
    }

    if (subcommand === "listar") {
      await interaction.deferReply();

      const missions = await prisma.communityMission.findMany({
        where: { guildId: interaction.guild.id, active: true },
        orderBy: { createdAt: "desc" },
      });

      if (missions.length === 0) {
        return interaction.editReply("Nenhuma missão ativa no momento. Fique de olho!");
      }

      const embed = new EmbedBuilder()
        .setTitle("🎯 Missões da Comunidade")
        .setColor("#FFD700")
        .setDescription("Complete estas missões para ganhar pontos e recompensas!")
        .addFields(
          missions.map((m) => ({
            name: `📌 ${m.title}`,
            value: `${m.description}\n**Recompensa:** ${m.points} pts${m.reward ? ` | ${m.reward}` : ""}${isAdmin ? `\n*(ID: ${m.id})*` : ""}`,
          }))
        );

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
