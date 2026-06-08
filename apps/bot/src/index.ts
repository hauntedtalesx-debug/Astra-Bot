import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { loadEvents } from './handlers/events';
import { loadCommands } from './handlers/commands';
import { startCronJobs } from './utils/cron';

// Load env vars from root .env if running locally
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Dummy HTTP server to satisfy Render Web Service port binding
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Astra Bot is online!');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Dummy web server listening on port ${PORT}`);
});

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Extend client to store commands
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
  }
}

client.commands = new Collection();

async function start() {
  try {
    console.log('Starting Astra Bot...');
    await loadEvents(client);
    await loadCommands(client);
    
    startCronJobs(client);
    
    await client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (error) {
    console.error('Error starting bot:', error);
  }
}

start();
