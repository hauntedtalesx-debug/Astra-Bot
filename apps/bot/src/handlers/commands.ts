import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';

export async function loadCommands(client: Client) {
  const commandsPath = path.join(__dirname, '../commands');
  if (!fs.existsSync(commandsPath)) return;
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    
    if ('data' in command.default && 'execute' in command.default) {
      client.commands.set(command.default.data.name, command.default);
    } else {
      console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
  console.log(`Loaded ${client.commands.size} commands.`);
}
