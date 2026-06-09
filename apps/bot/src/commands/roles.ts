import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { prisma } from "@astra/db";
import { isAstraAdmin, checkBotPermissions } from "../utils/permissions";

export default {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Gerencia o painel de cargos automáticos por interesse")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("adicionar")
        .setDescription("Adiciona um cargo disponível no painel de auto-roles")
        .addRoleOption((option) => option.setName("cargo").setDescription("O cargo que a pessoa pode pegar").setRequired(true))
        .addStringOption((option) => option.setName("nome").setDescription("Nome ou emoji do botão").setRequired(true))
        .addStringOption((option) => option.setName("descricao").setDescription("Breve descrição (opcional)").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remover")
        .setDescription("Remove um cargo do painel")
        .addRoleOption((option) => option.setName("cargo").setDescription("Cargo a remover do painel").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("painel")
        .setDescription("Gera e envia o painel interativo no canal atual")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ content: "❌ Apenas administradores podem usar este comando.", ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "adicionar") {
      await interaction.deferReply({ ephemeral: true });

      const role = interaction.options.getRole("cargo", true);
      const name = interaction.options.getString("nome", true);
      const description = interaction.options.getString("descricao");

      // Verify if the bot can manage this role
      const botMember = interaction.guild.members.me;
      if (!botMember || botMember.roles.highest.position <= (role as any).position) {
        return interaction.editReply("❌ Eu não posso gerenciar esse cargo porque ele está acima do meu cargo na hierarquia do servidor.");
      }

      await prisma.autoRole.upsert({
        where: { guildId_roleId: { guildId: interaction.guild.id, roleId: role.id } },
        update: { name, description },
        create: { guildId: interaction.guild.id, roleId: role.id, name, description },
      });

      await interaction.editReply(`✅ Cargo <@&${role.id}> adicionado ao sistema com o botão **${name}**.`);
    }

    if (subcommand === "remover") {
      await interaction.deferReply({ ephemeral: true });
      const role = interaction.options.getRole("cargo", true);

      try {
        await prisma.autoRole.delete({
          where: { guildId_roleId: { guildId: interaction.guild.id, roleId: role.id } },
        });
        await interaction.editReply("✅ Cargo removido do painel.");
      } catch (e) {
        await interaction.editReply("❌ Este cargo não estava no painel.");
      }
    }

    if (subcommand === "painel") {
      await interaction.deferReply({ ephemeral: true });

      if (!(await checkBotPermissions(interaction, ["ViewChannel", "SendMessages", "EmbedLinks", "ManageRoles"]))) {
        return;
      }

      const roles = await prisma.autoRole.findMany({ where: { guildId: interaction.guild.id } });

      if (roles.length === 0) {
        return interaction.editReply("❌ Nenhum cargo configurado. Use `/roles adicionar` primeiro.");
      }

      const embed = new EmbedBuilder()
        .setTitle("🎭 Cargos por Interesse")
        .setColor("#8a2be2")
        .setDescription("Clique nos botões abaixo para receber os cargos correspondentes aos seus interesses e ser notificado sobre novidades!\n\n" + 
          roles.map(r => `**${r.name}** - <@&${r.roleId}> ${r.description ? `\n└ *${r.description}*` : ''}`).join("\n\n")
        );

      const rows: ActionRowBuilder<ButtonBuilder>[] = [];
      let currentRow = new ActionRowBuilder<ButtonBuilder>();

      roles.forEach((r, index) => {
        if (index > 0 && index % 5 === 0) {
          rows.push(currentRow);
          currentRow = new ActionRowBuilder<ButtonBuilder>();
        }
        
        currentRow.addComponents(
          new ButtonBuilder()
            .setCustomId(`autorole_${r.roleId}`)
            .setLabel(r.name)
            .setStyle(ButtonStyle.Primary)
        );
      });
      rows.push(currentRow);

      const channel = interaction.channel;
      if (channel && 'send' in channel) {
        await channel.send({ embeds: [embed], components: rows as any });
      }

      await interaction.editReply("✅ Painel gerado com sucesso no canal!");
    }
  },
};
