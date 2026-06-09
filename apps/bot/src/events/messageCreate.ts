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

    try {
      // Lógica de Sticky Message
      const sticky = await prisma.stickyMessage.findUnique({
        where: { guildId_channelId: { guildId, channelId } },
        include: { guild: { include: { settings: true } } }
      });

      if (sticky && sticky.active && (!sticky.guild.settings || sticky.guild.settings.stickyEnabled)) {
        if (sticky.lastMessageId) {
          try {
            const oldMsg = await message.channel.messages.fetch(sticky.lastMessageId);
            if (oldMsg) await oldMsg.delete();
          } catch (e) {
            // Ignorar se a mensagem antiga não existir mais
          }
        }
        
        const embed = { color: 0xFFFF00, description: `📌 **Mensagem Fixada:**\n${sticky.messageText}` };
        if ('send' in message.channel) {
          const newMsg = await message.channel.send({ embeds: [embed] });
          await prisma.stickyMessage.update({
            where: { id: sticky.id },
            data: { lastMessageId: newMsg.id }
          });
        }
      }
    } catch (e) {
      console.error("Erro no Sticky Message:", e);
    }

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
