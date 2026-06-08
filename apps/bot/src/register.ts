import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

const commands = [];

async function main() {
  for (const file of commandFiles) {
    const command = await import(path.join(commandsPath, file));
    if (command.default && command.default.data) {
      commands.push(command.default.data.toJSON());
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN as string);

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // If a guild ID is provided, it registers only to that guild (faster for dev)
    const guildId = process.env.DISCORD_GUILD_ID_DEV;
    const clientId = process.env.DISCORD_CLIENT_ID as string;

    if (guildId) {
      const data: any = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
    } else {
      const data: any = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} global (/) commands.`);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
