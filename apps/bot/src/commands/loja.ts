import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { prisma } from '@astra/db';
import { checkBotPermissions, isAstraAdmin } from '../utils/permissions';

export default {
  data: new SlashCommandBuilder()
    .setName('loja')
    .setDescription('Gerencia e acessa a Loja da Comunidade.')
    .addSubcommand(subcmd => 
      subcmd.setName('painel')
        .setDescription('Mostra a vitrine da loja no chat.')
    )
    .addSubcommand(subcmd =>
      subcmd.setName('adicionar')
        .setDescription('Adiciona um item à loja (Apenas Admins).')
        .addStringOption(opt => opt.setName('nome').setDescription('Nome do item').setRequired(true))
        .addIntegerOption(opt => opt.setName('preco').setDescription('Preço em pontos').setRequired(true))
        .addStringOption(opt => opt.setName('descricao').setDescription('Descrição do item').setRequired(false))
        .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo para dar automaticamente ao comprar').setRequired(false))
    )
    .addSubcommand(subcmd =>
      subcmd.setName('remover')
        .setDescription('Remove um item da loja (Apenas Admins).')
        .addStringOption(opt => opt.setName('id').setDescription('ID do item').setRequired(true))
    )
    .addSubcommand(subcmd =>
      subcmd.setName('saldo')
        .setDescription('Verifica o seu saldo de pontos.')
        .addUserOption(opt => opt.setName('usuario').setDescription('Ver o saldo de outro usuário').setRequired(false))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (!guildId) return interaction.reply({ content: 'Apenas para servidores.', ephemeral: true });

    if (subcommand === 'adicionar') {
      const member = interaction.guild?.members.cache.get(interaction.user.id);
      if (!member) return;
      const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
      if (!(await isAstraAdmin(member, settings?.astraAdminRoleId))) {
        return interaction.reply({ content: '❌ Você não tem permissão para adicionar itens.', ephemeral: true });
      }

      const name = interaction.options.getString('nome', true);
      const price = interaction.options.getInteger('preco', true);
      const description = interaction.options.getString('descricao');
      const role = interaction.options.getRole('cargo');

      await interaction.deferReply({ ephemeral: true });

      const item = await prisma.storeItem.create({
        data: {
          guildId,
          name,
          price,
          description,
          roleId: role ? role.id : null
        }
      });

      await interaction.editReply(`✅ Item **${name}** adicionado à loja por **${price} pontos**! (ID: \`${item.id}\`)`);
      return;
    }

    if (subcommand === 'remover') {
      const member = interaction.guild?.members.cache.get(interaction.user.id);
      if (!member) return;
      const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
      if (!(await isAstraAdmin(member, settings?.astraAdminRoleId))) {
        return interaction.reply({ content: '❌ Você não tem permissão para remover itens.', ephemeral: true });
      }

      const id = interaction.options.getString('id', true);
      await interaction.deferReply({ ephemeral: true });

      try {
        await prisma.storeItem.delete({ where: { id, guildId } });
        await interaction.editReply('🗑️ Item removido da loja.');
      } catch (e) {
        await interaction.editReply('❌ Item não encontrado.');
      }
      return;
    }

    if (subcommand === 'saldo') {
      const targetUser = interaction.options.getUser('usuario') || interaction.user;
      const activity = await prisma.memberActivity.findUnique({
        where: { guildId_userId: { guildId, userId: targetUser.id } }
      });
      
      const points = activity?.points || 0;
      await interaction.reply({ content: `💰 ${targetUser.id === interaction.user.id ? 'Você tem' : `<@${targetUser.id}> tem`} **${points} AstraCoins**!`, ephemeral: true });
      return;
    }

    if (subcommand === 'painel') {
      const items = await prisma.storeItem.findMany({ where: { guildId, active: true }, orderBy: { price: 'asc' } });
      
      if (items.length === 0) {
        return interaction.reply({ content: 'A loja está vazia no momento.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle("🛒 Loja da Comunidade")
        .setDescription("Bem-vindo à loja! Use seus pontos para comprar recompensas.")
        .setColor("#FF8C00");

      items.forEach(item => {
        embed.addFields({
          name: `${item.name} — 💰 ${item.price}`,
          value: item.description ? item.description : 'Sem descrição'
        });
      });

      const options = items.map(item => ({
        label: item.name,
        description: `Custa ${item.price} pontos`,
        value: `buy_${item.id}`,
      }));

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('shop_select')
          .setPlaceholder('Escolha um item para comprar...')
          .addOptions(options)
      );

      const channel = interaction.channel;
      if (channel && 'send' in channel) {
        await channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Vitrine da loja enviada com sucesso!', ephemeral: true });
      }
    }
  },
};
