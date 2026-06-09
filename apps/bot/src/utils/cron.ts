import { Client, TextChannel, EmbedBuilder } from 'discord.js';
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

  // Integration Check: Twitch/YouTube Live & Youtube Videos (Runs every 5 minutes)
  cron.schedule('*/5 * * * *', async () => {
    try {
      const integrations = await prisma.creatorIntegration.findMany({
        where: { enabled: true },
        include: { guild: { include: { settings: true } } }
      });

      for (const integration of integrations) {
        if (!integration.guild.settings?.liveEnabled) continue;

        // In a real scenario, here we'd fetch from Twitch API
        // if (process.env.TWITCH_CLIENT_ID) { ... }
        
        // Mock Implementation for demonstration purposes:
        // Let's pretend we hit the API and it's online but we prevent spam by checking lastLiveId
        // In real code: check if online, get current liveId, compare with lastLiveId.
        const mockLiveId = "live_" + new Date().toISOString().split('T')[0]; // One per day max
        
        if (integration.lastLiveId !== mockLiveId) {
          const channel = client.channels.cache.get(integration.discordChannelId) as TextChannel;
          if (channel) {
            const embed = new EmbedBuilder()
              .setTitle(`🔴 ${integration.creatorUsername} está ao vivo!`)
              .setDescription(`A Astra detectou a live na plataforma ${integration.platform} e avisou a comunidade!\n\n**Assistir agora:** https://${integration.platform}.com/${integration.creatorUsername}`)
              .setColor("#9146FF");

            await channel.send({ 
              content: integration.customMessage ? integration.customMessage : (integration.mentionRoleId ? `<@&${integration.mentionRoleId}>` : ''),
              embeds: [embed] 
            });
            
            await prisma.creatorIntegration.update({
              where: { id: integration.id },
              data: { lastLiveId: mockLiveId, lastAnnouncedAt: new Date() }
            });

            await prisma.liveAnnouncementLog.create({
              data: {
                guildId: integration.guildId,
                integrationId: integration.id,
                platform: integration.platform,
                liveId: mockLiveId,
                title: "Live Mockada",
                url: `https://${integration.platform}.com/${integration.creatorUsername}`
              }
            });
          }
        }
      }

      // YouTube Videos Check
      const ytIntegrations = await prisma.youtubeIntegration.findMany({
        where: { enabled: true },
        include: { guild: { include: { settings: true } } }
      });

      for (const yt of ytIntegrations) {
        if (!yt.guild.settings?.youtubeEnabled) continue;

        // Mock Implementation
        const mockVideoId = "video_" + new Date().toISOString().split('T')[0];
        
        if (yt.lastVideoId !== mockVideoId) {
          const channel = client.channels.cache.get(yt.discordChannelId) as TextChannel;
          if (channel) {
            const embed = new EmbedBuilder()
              .setTitle("🎬 Novo vídeo no canal!")
              .setDescription(`Saiu vídeo novo do **${yt.youtubeChannelName}**!\n\nDepois de assistir, volta aqui e comenta: *Qual foi a melhor parte do vídeo?*`)
              .setColor("#FF0000")
              .setURL(`https://youtube.com/channel/${yt.youtubeChannelId}`);

            await channel.send({ 
              content: yt.mentionRoleId ? `<@&${yt.mentionRoleId}>` : '',
              embeds: [embed] 
            });
            
            await prisma.youtubeIntegration.update({
              where: { id: yt.id },
              data: { lastVideoId: mockVideoId }
            });

            await prisma.youtubeAnnouncementLog.create({
              data: {
                guildId: yt.guildId,
                integrationId: yt.id,
                videoId: mockVideoId,
                title: "Video Mockado",
                url: `https://youtube.com/channel/${yt.youtubeChannelId}`
              }
            });
          }
        }
      }

    } catch (e) {
      console.error('Error on integration checks cron:', e);
    }
  });

  // Giveaway check (runs every minute)
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const endedGiveaways = await prisma.giveaway.findMany({
        where: { active: true, endAt: { lte: now } }
      });

      for (const giveaway of endedGiveaways) {
        await prisma.giveaway.update({
          where: { id: giveaway.id },
          data: { active: false }
        });

        const channel = client.channels.cache.get(giveaway.channelId) as TextChannel;
        if (!channel) continue;

        try {
          const message = await channel.messages.fetch(giveaway.messageId!);
          if (!message) continue;

          const reaction = message.reactions.cache.get('🎉');
          if (!reaction) continue;

          const users = await reaction.users.fetch();
          const validUsers = users.filter(u => !u.bot).map(u => u.id);

          if (validUsers.length === 0) {
            await channel.send(`O sorteio de **${giveaway.prize}** terminou, mas infelizmente ninguém participou! 😢`);
            continue;
          }

          // Pick random winners
          const winners: string[] = [];
          for (let i = 0; i < Math.min(giveaway.winnersCount, validUsers.length); i++) {
            const r = Math.floor(Math.random() * validUsers.length);
            winners.push(validUsers[r]);
            validUsers.splice(r, 1);
          }

          const winnersText = winners.map(id => `<@${id}>`).join(', ');
          await message.reply(`🎉 Parabéns ${winnersText}! Vocês ganharam: **${giveaway.prize}**!`);
        } catch (e) {
          console.error(`Error finishing giveaway ${giveaway.id}`, e);
        }
      }
    } catch (e) {
      console.error('Error on giveaway cron:', e);
    }
  });

  console.log('Cron jobs started.');
}
