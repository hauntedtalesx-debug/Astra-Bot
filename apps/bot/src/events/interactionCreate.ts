import { Events, Interaction, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '@astra/db';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    // Handler para criar ticket
    if (interaction.isButton() && interaction.customId === 'ticket_open') {
      const guild = interaction.guild;
      if (!guild) return;

      await interaction.deferReply({ ephemeral: true });

      // Verificar se já tem ticket aberto
      const existingTicket = await prisma.ticket.findFirst({
        where: { guildId: guild.id, userId: interaction.user.id, status: 'OPEN' }
      });

      if (existingTicket) {
        return interaction.editReply(`Você já tem um ticket aberto no canal <#${existingTicket.channelId}>.`);
      }

      try {
        const settings = await prisma.guildSettings.findUnique({ where: { guildId: guild.id } });
        
        // Criar o canal privado
        const ticketChannel = await guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
            },
            ...(settings?.astraAdminRoleId ? [{
              id: settings.astraAdminRoleId,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
            }] : [])
          ],
        });

        // Registrar no banco
        await prisma.ticket.create({
          data: {
            guildId: guild.id,
            userId: interaction.user.id,
            channelId: ticketChannel.id,
            status: 'OPEN'
          }
        });

        // Registrar Log
        await prisma.auditLog.create({
          data: {
            guildId: guild.id,
            userId: interaction.user.id,
            action: 'TICKET_OPENED',
            metadata: JSON.stringify({ channelId: ticketChannel.id })
          }
        });

        const embed = new EmbedBuilder()
          .setTitle("🎫 Ticket de Suporte")
          .setDescription(`Olá <@${interaction.user.id}>! A equipe já vai te atender. Descreva o seu problema.\nPara encerrar o ticket, clique no botão abaixo.`)
          .setColor("#00BFFF");

        const closeRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket_close")
            .setLabel("Fechar Ticket")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("🔒")
        );

        await ticketChannel.send({
          content: `<@${interaction.user.id}>${settings?.astraAdminRoleId ? ` <@&${settings.astraAdminRoleId}>` : ''}`,
          embeds: [embed],
          components: [closeRow]
        });

        await interaction.editReply(`Ticket criado com sucesso em <#${ticketChannel.id}>!`);
      } catch (e) {
        console.error("Erro ao criar ticket:", e);
        await interaction.editReply("❌ Ocorreu um erro ao criar o ticket. Verifique as permissões da Astra.");
      }
      return;
    }

    // Handler para fechar ticket
    if (interaction.isButton() && interaction.customId === 'ticket_close') {
      const guild = interaction.guild;
      if (!guild) return;

      await interaction.deferReply();

      const ticket = await prisma.ticket.findFirst({
        where: { guildId: guild.id, channelId: interaction.channelId, status: 'OPEN' }
      });

      if (!ticket) {
        return interaction.editReply("❌ Este não é um ticket aberto ou já foi fechado.");
      }

      try {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: 'CLOSED', closedAt: new Date() }
        });

        await prisma.auditLog.create({
          data: {
            guildId: guild.id,
            userId: interaction.user.id,
            action: 'TICKET_CLOSED',
            metadata: JSON.stringify({ channelId: ticket.channelId })
          }
        });

        await interaction.editReply("🔒 O ticket será fechado em 5 segundos...");
        
        setTimeout(async () => {
          if (interaction.channel && 'delete' in interaction.channel) {
            await interaction.channel.delete().catch(() => {});
          }
        }, 5000);
      } catch (e) {
        console.error("Erro ao fechar ticket:", e);
        await interaction.editReply("❌ Erro ao fechar o ticket.");
      }
      return;
    }

    if (interaction.isButton()) {
      if (interaction.customId.startsWith('autorole_')) {
        const roleId = interaction.customId.split('_')[1];
        const member = interaction.member as any;
        
        try {
          if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId);
            await interaction.reply({ content: `✅ Cargo removido com sucesso!`, ephemeral: true });
          } else {
            await member.roles.add(roleId);
            await interaction.reply({ content: `✅ Cargo adicionado com sucesso!`, ephemeral: true });
          }
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: '❌ Ocorreu um erro ao modificar o seu cargo. Verifique se o bot tem permissões.', ephemeral: true });
        }
        return;
      }
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'shop_select') {
      const guild = interaction.guild;
      if (!guild) return;

      const selected = interaction.values[0];
      if (!selected.startsWith('buy_')) return;
      const itemId = selected.replace('buy_', '');

      await interaction.deferReply({ ephemeral: true });

      const item = await prisma.storeItem.findUnique({ where: { id: itemId } });
      if (!item || !item.active) {
        return interaction.editReply("❌ Este item não está mais disponível na loja.");
      }

      // Check balance
      const activity = await prisma.memberActivity.findUnique({
        where: { guildId_userId: { guildId: guild.id, userId: interaction.user.id } }
      });

      const points = activity?.points || 0;
      if (points < item.price) {
        return interaction.editReply(`❌ Você não tem AstraCoins suficientes. Este item custa **${item.price}**, mas você só tem **${points}**.`);
      }

      try {
        // Deduct points
        await prisma.memberActivity.update({
          where: { guildId_userId: { guildId: guild.id, userId: interaction.user.id } },
          data: { points: { decrement: item.price } }
        });

        // Register purchase
        await prisma.purchase.create({
          data: { guildId: guild.id, userId: interaction.user.id, itemId: item.id }
        });

        // Give role if needed
        if (item.roleId) {
          const member = interaction.member as any;
          if (member && !member.roles.cache.has(item.roleId)) {
            await member.roles.add(item.roleId).catch(() => console.error("Sem permissão para dar o cargo da loja"));
          }
        }

        // Log audit
        await prisma.auditLog.create({
          data: {
            guildId: guild.id,
            userId: interaction.user.id,
            action: 'STORE_PURCHASE',
            metadata: JSON.stringify({ itemId: item.id, itemName: item.name, price: item.price })
          }
        });

        await interaction.editReply(`✅ Compra efetuada com sucesso! Você comprou: **${item.name}**.`);
      } catch (e) {
        console.error("Error processing purchase:", e);
        await interaction.editReply("❌ Ocorreu um erro ao processar sua compra.");
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Houve um erro ao executar este comando!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Houve um erro ao executar este comando!', ephemeral: true });
      }
    }
  },
};
