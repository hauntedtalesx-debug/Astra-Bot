import { Client, Events, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);

    // Registrar comandos automaticamente no ready
    try {
      const commandsPath = path.join(__dirname, '../commands');
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
      const commands = [];

      for (const file of commandFiles) {
        // Use pathToFileURL to prevent issues with absolute paths on Windows/Linux in import()
        const command = await import(`file://${path.join(commandsPath, file)}`);
        if (command.default && command.default.data) {
          commands.push(command.default.data.toJSON());
        }
      }

      const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN as string);
      const clientId = client.user!.id;
      const guildId = process.env.DISCORD_GUILD_ID_DEV;

      if (guildId) {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log(`✅ [Ready] Registered ${commands.length} commands to guild ${guildId}`);
      } else {
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log(`✅ [Ready] Registered ${commands.length} global commands.`);
      }
    } catch (error) {
      console.error('❌ [Ready] Error registering commands:', error);
    }
  },
};
