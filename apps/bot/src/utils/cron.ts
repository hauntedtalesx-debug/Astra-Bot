import { Client } from 'discord.js';
import cron from 'node-cron';

export function startCronJobs(client: Client) {
  // Cron para posts diários (exemplo: roda a cada minuto para checar)
  cron.schedule('* * * * *', () => {
    // Lógica para checar AutoPostSchedule
  });

  // Cron para relatórios semanais
  cron.schedule('0 0 * * 0', () => { // Domingo meia-noite
    // Lógica para WeeklyReport
  });

  console.log('Cron jobs started.');
}
