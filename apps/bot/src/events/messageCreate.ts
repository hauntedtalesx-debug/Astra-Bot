import { Events, Message } from 'discord.js';
import { prisma } from '@astra/db';

const userCooldowns = new Map<string, number>();
const COOLDOWN_TIME = 60000; // 1 minuto de limite por usuário

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return; // ignore bots
    if (!message.guildId) return; // ignore DMs
    if (message.content.length < 5) return; // ignore mensagens muito curtas

    const guildId = message.guildId;
    const userId = message.author.id;
    const channelId = message.channelId;

    // Check rate limit (1 message per minute yields points)
    const key = `${guildId}-${userId}`;
    const lastTime = userCooldowns.get(key) || 0;
    const now = Date.now();

    if (now - lastTime < COOLDOWN_TIME) {
      return; // spam or rate limit
    }

    try {
      // Verifica se a guilda existe no banco (se o /setup já foi feito)
      const dbGuild = await prisma.guild.findUnique({ where: { id: guildId } });
      if (!dbGuild) return;

      // Verifica se o canal é ignorado
      const ignored = await prisma.ignoredChannel.findUnique({
        where: { guildId_channelId: { guildId, channelId } }
      });
      if (ignored) return;

      // Adiciona a contagem no banco
      await prisma.memberActivity.upsert({
        where: { guildId_userId: { guildId, userId } },
        update: { 
          messageCount: { increment: 1 },
          weeklyMessageCount: { increment: 1 },
          monthlyMessageCount: { increment: 1 },
          lastMessageAt: new Date()
        },
        create: {
          guildId,
          userId,
          messageCount: 1,
          weeklyMessageCount: 1,
          monthlyMessageCount: 1,
        }
      });

      // Update cooldown
      userCooldowns.set(key, now);
    } catch (error) {
      console.error('Erro ao computar XP do membro:', error);
    }
  },
};
