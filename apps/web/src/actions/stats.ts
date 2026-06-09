"use server";

import { prisma } from "@astra/db";

export async function getAstraStats() {
  try {
    const guildsCount = await prisma.guild.count();
    const membersCount = await prisma.memberActivity.count();
    // For commands, since we don't have a direct table for it, we can use a multiplier or just return 0 if not tracked
    // Wait, audit logs could be proxy for some commands, but let's just make it a multiple of messages for now,
    // or just return the sum of all messages
    
    const messagesAgg = await prisma.memberActivity.aggregate({
      _sum: {
        messageCount: true,
      }
    });

    return {
      guilds: guildsCount,
      members: membersCount,
      messages: messagesAgg._sum.messageCount || 0
    };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return {
      guilds: 0,
      members: 0,
      messages: 0
    };
  }
}
