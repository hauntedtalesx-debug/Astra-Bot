import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { prisma } from "@astra/db";
import { isAstraAdmin } from "../utils/permissions";

const DAYS_OF_WEEK = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export default {
  data: new SlashCommandBuilder()
    .setName("agenda")
    .setDescription("Gerencia e exibe a agenda de lives e vídeos da semana")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("adicionar")
        .setDescription("[Admin] Adiciona um evento na agenda")
        .addIntegerOption((option) =>
          option
            .setName("dia")
            .setDescription("Dia da semana")
            .setRequired(true)
            .addChoices(
              { name: "Domingo", value: 0 },
              { name: "Segunda-feira", value: 1 },
              { name: "Terça-feira", value: 2 },
              { name: "Quarta-feira", value: 3 },
              { name: "Quinta-feira", value: 4 },
              { name: "Sexta-feira", value: 5 },
              { name: "Sábado", value: 6 }
            )
        )
        .addStringOption((option) => option.setName("horario").setDescription("Horário (ex: 19:00)").setRequired(true))
        .addStringOption((option) => option.setName("titulo").setDescription("Título (ex: Live de Valorant)").setRequired(true))
        .addBooleanOption((option) => option.setName("live").setDescription("É uma transmissão ao vivo?").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remover")
        .setDescription("[Admin] Remove um evento da agenda")
        .addStringOption((option) => option.setName("id").setDescription("ID do evento (veja em /agenda listar)").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("listar").setDescription("Mostra a programação da semana para a comunidade")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const subcommand = interaction.options.getSubcommand();
    const isAdmin = await isAstraAdmin(interaction.member as any);

    if (subcommand === "adicionar") {
      if (!isAdmin) return interaction.reply({ content: "❌ Comando apenas para admins.", ephemeral: true });
      await interaction.deferReply({ ephemeral: true });

      const dayOfWeek = interaction.options.getInteger("dia", true);
      const time = interaction.options.getString("horario", true);
      const title = interaction.options.getString("titulo", true);
      const isLive = interaction.options.getBoolean("live") ?? false;

      // Regex to validate time format HH:mm
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
        return interaction.editReply("❌ Formato de horário inválido. Use HH:mm (ex: 19:30).");
      }

      await prisma.creatorSchedule.create({
        data: {
          guildId: interaction.guild.id,
          dayOfWeek,
          time,
          title,
          isLive,
        },
      });

      await interaction.editReply(`✅ Evento **${title}** adicionado na **${DAYS_OF_WEEK[dayOfWeek]}** às **${time}**.`);
    }

    if (subcommand === "remover") {
      if (!isAdmin) return interaction.reply({ content: "❌ Comando apenas para admins.", ephemeral: true });
      await interaction.deferReply({ ephemeral: true });

      const id = interaction.options.getString("id", true);

      try {
        await prisma.creatorSchedule.delete({
          where: { id, guildId: interaction.guild.id },
        });
        await interaction.editReply("✅ Evento removido da agenda.");
      } catch (e) {
        await interaction.editReply("❌ Evento não encontrado.");
      }
    }

    if (subcommand === "listar") {
      await interaction.deferReply();

      const events = await prisma.creatorSchedule.findMany({
        where: { guildId: interaction.guild.id },
        orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
      });

      if (events.length === 0) {
        return interaction.editReply("Nenhum evento na agenda no momento.");
      }

      const embed = new EmbedBuilder()
        .setTitle("📅 Agenda da Semana")
        .setColor("#00FFFF")
        .setDescription("Confira nossa programação dos próximos dias!");

      // Group by day
      const grouped: Record<number, typeof events> = {};
      for (const e of events) {
        if (!grouped[e.dayOfWeek]) grouped[e.dayOfWeek] = [];
        grouped[e.dayOfWeek].push(e);
      }

      for (let i = 0; i < 7; i++) {
        if (grouped[i]) {
          const dayEvents = grouped[i]
            .map((e) => `\`${e.time}\` ${e.isLive ? "🔴" : "▶️"} **${e.title}** ${isAdmin ? `*(ID: ${e.id})*` : ""}`)
            .join("\n");
          embed.addFields({ name: DAYS_OF_WEEK[i], value: dayEvents });
        }
      }

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
