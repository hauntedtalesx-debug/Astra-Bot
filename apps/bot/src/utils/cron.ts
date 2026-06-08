import { Client, TextChannel } from 'discord.js';
import cron from 'node-cron';
import { prisma } from '@astra/db';

export function startCronJobs(client: Client) {
  // Cron for auto-posts (runs every minute)
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    try {
      const schedules = await prisma.autoPostSchedule.findMany({
        where: { active: true, time: currentTime },
        include: { guild: { include: { settings: true } } }
      });

      for (const schedule of schedules) {
        if (schedule.guild.settings?.autoPostPaused) continue;

        // Skip logic based on frequency
        const day = now.getDay();
        if (schedule.frequency === 'weekly' && day !== 1) continue; // Only Monday
        if (schedule.frequency === '3_per_week' && ![1, 3, 5].includes(day)) continue; // Mon, Wed, Fri

        const channel = client.channels.cache.get(schedule.channelId) as TextChannel;
        if (!channel) continue;

        // In a real app we would use AI or advanced templates here
        const Templates = await import('@astra/shared').then(m => m.Templates).catch(() => null);
        if (!Templates) continue;

        const lang = schedule.guild.settings?.language || 'pt-BR';
        const niche = schedule.guild.settings?.niche || 'variedades';
        let items: string[] = [];

        if (schedule.type === 'pergunta' && Templates.pergunta) {
          items = Templates.pergunta[lang]?.[niche] || Templates.pergunta['pt-BR']!['variedades'];
        } else if (schedule.type === 'desafio' && Templates.desafio) {
          items = Templates.desafio[lang]?.[niche] || Templates.desafio['pt-BR']!['variedades'];
        } else {
          items = ["Comunidade, qual a novidade de hoje?"];
        }

        const text = items[Math.floor(Math.random() * items.length)];
        await channel.send(`**[${schedule.type.toUpperCase()}]**\n${text}`);
      }
    } catch (e) {
      console.error('Error running auto-post cron:', e);
    }
  });

  // Weekly Reset & Weekly Report (Sunday 23:59)
  cron.schedule('59 23 * * 0', async () => {
    console.log('Running weekly reset and reports...');
    try {
      // 1. Send Weekly Reports
      const settingsWithReport = await prisma.guildSettings.findMany({
        where: { weeklyReportChannelId: { not: null } }
      });

      for (const settings of settingsWithReport) {
        if (!settings.weeklyReportChannelId) continue;
        const channel = client.channels.cache.get(settings.weeklyReportChannelId) as TextChannel;
        if (channel) {
          await channel.send('📊 **Relatório Semanal da Comunidade:** A semana foi encerrada! Use `/relatorio gerar` para ver as estatísticas completas.');
        }
      }

      // 2. Reset weeklyMessageCount
      await prisma.memberActivity.updateMany({
        data: { weeklyMessageCount: 0 }
      });
    } catch (e) {
      console.error('Error on weekly cron:', e);
    }
  });

  // Monthly Reset (1st of every month at 00:00)
  cron.schedule('0 0 1 * *', async () => {
    console.log('Running monthly reset...');
    try {
      await prisma.memberActivity.updateMany({
        data: { monthlyMessageCount: 0 }
      });
    } catch (e) {
      console.error('Error on monthly cron:', e);
    }
  });

  console.log('Cron jobs started.');
}
