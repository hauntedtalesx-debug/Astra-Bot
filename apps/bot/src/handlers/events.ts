import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';

export async function loadEvents(client: Client) {
  const eventsPath = path.join(__dirname, '../events');
  if (!fs.existsSync(eventsPath)) return;
  
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    
    if (event.default?.once) {
      client.once(event.default.name, (...args) => event.default.execute(...args, client));
    } else if (event.default) {
      client.on(event.default.name, (...args) => event.default.execute(...args, client));
    }
  }
  console.log(`Loaded ${eventFiles.length} events.`);
}
