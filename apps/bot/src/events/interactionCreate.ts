import { Events, Interaction } from 'discord.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
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
