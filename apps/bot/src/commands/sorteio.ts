import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { prisma } from "@astra/db";
import { isAstraAdmin, checkBotPermissions } from "../utils/permissions";

export default {
  data: new SlashCommandBuilder()
    .setName("sorteio")
    .setDescription("Gerencia sorteios rápidos no servidor")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("criar")
        .setDescription("Inicia um novo sorteio")
        .addStringOption((option) => option.setName("premio").setDescription("Qual é o prêmio?").setRequired(true))
        .addStringOption((option) => option.setName("duracao").setDescription("Duração em horas (ex: 24)").setRequired(true))
        .addIntegerOption((option) => option.setName("vencedores").setDescription("Quantidade de vencedores").setRequired(false))
        .addStringOption((option) => option.setName("descricao").setDescription("Regras ou descrição adicional").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("encerrar")
        .setDescription("Encerra um sorteio antecipadamente")
        .addStringOption((option) => option.setName("id").setDescription("ID do sorteio").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("listar").setDescription("Lista todos os sorteios ativos")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ content: "❌ Apenas administradores podem usar este comando.", ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "criar") {
      await interaction.deferReply();

      if (!(await checkBotPermissions(interaction, ["ViewChannel", "SendMessages", "EmbedLinks"]))) {
        return;
      }

      const prize = interaction.options.getString("premio", true);
      const hoursStr = interaction.options.getString("duracao", true);
      const winnersCount = interaction.options.getInteger("vencedores") || 1;
      const description = interaction.options.getString("descricao");

      const hours = parseFloat(hoursStr);
      if (isNaN(hours) || hours <= 0) {
        return interaction.editReply("❌ Duração inválida.");
      }

      const endAt = new Date(Date.now() + hours * 3600 * 1000);

      const embed = new EmbedBuilder()
        .setTitle(`🎉 Sorteio: ${prize}`)
        .setColor("#FFD700")
        .setDescription(`${description ? `${description}\n\n` : ''}Reaja com 🎉 para participar!\n\n**Vencedores:** ${winnersCount}\n**Termina em:** <t:${Math.floor(endAt.getTime() / 1000)}:R>`);

      const channel = interaction.channel;
      if (!channel || !('send' in channel)) return;

      const message = await channel.send({ embeds: [embed] });
      await message.react("🎉");

      const giveaway = await prisma.giveaway.create({
        data: {
          guildId: interaction.guild.id,
          title: prize,
          prize,
          description,
          winnersCount,
          endAt,
          channelId: channel.id,
          messageId: message.id,
        },
      });

      await interaction.editReply(`✅ Sorteio criado! ID: \`${giveaway.id}\``);
    }

    if (subcommand === "encerrar") {
      await interaction.deferReply({ ephemeral: true });
      const id = interaction.options.getString("id", true);

      try {
        const giveaway = await prisma.giveaway.findUnique({ where: { id, guildId: interaction.guild.id } });
        if (!giveaway || !giveaway.active) {
          return interaction.editReply("❌ Sorteio não encontrado ou já encerrado.");
        }

        await prisma.giveaway.update({
          where: { id },
          data: { active: false, endAt: new Date() },
        });

        await interaction.editReply("✅ Sorteio encerrado! O sistema sorteará em breve.");
      } catch (e) {
        await interaction.editReply("❌ Erro ao encerrar o sorteio.");
      }
    }

    if (subcommand === "listar") {
      await interaction.deferReply({ ephemeral: true });

      const giveaways = await prisma.giveaway.findMany({
        where: { guildId: interaction.guild.id, active: true },
      });

      if (giveaways.length === 0) {
        return interaction.editReply("Nenhum sorteio ativo.");
      }

      const embed = new EmbedBuilder()
        .setTitle("🎉 Sorteios Ativos")
        .setColor("#FFD700")
        .setDescription(
          giveaways.map(g => `**ID:** \`${g.id}\`\n**Prêmio:** ${g.prize}\n**Término:** <t:${Math.floor(g.endAt.getTime() / 1000)}:R>`).join("\n\n")
        );

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
