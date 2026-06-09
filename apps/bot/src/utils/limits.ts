import { prisma } from "@astra/db";

export type PlanLimits = {
  maxLives: number;
  maxYoutube: number;
  maxSticky: number;
  maxGiveaways: number;
  maxClips: number;
  maxShorts: number;
  maxPostsPerWeek: number;
  maxFaqs: number;
};

const DEFAULT_LIMITS: Record<string, PlanLimits> = {
  FREE: {
    maxLives: 1,
    maxYoutube: 1,
    maxSticky: 1,
    maxGiveaways: 1,
    maxClips: 5,
    maxShorts: 5,
    maxPostsPerWeek: 3,
    maxFaqs: 10,
  },
  PRO: {
    maxLives: 3,
    maxYoutube: 3,
    maxSticky: 5,
    maxGiveaways: 3,
    maxClips: 100,
    maxShorts: 100,
    maxPostsPerWeek: 7,
    maxFaqs: 100,
  },
  CREATOR: {
    maxLives: 10,
    maxYoutube: 10,
    maxSticky: 10,
    maxGiveaways: 10,
    maxClips: 1000,
    maxShorts: 1000,
    maxPostsPerWeek: 50,
    maxFaqs: 1000,
  },
};

/**
 * Gets the configured limits for a guild based on their current plan.
 */
export async function getGuildLimits(guildId: string): Promise<PlanLimits> {
  const settings = await prisma.guildSettings.findUnique({
    where: { guildId },
    include: { plan: true },
  });

  if (!settings || !settings.plan) {
    return DEFAULT_LIMITS["FREE"];
  }

  const planName = settings.plan.name.toUpperCase();
  return DEFAULT_LIMITS[planName] || DEFAULT_LIMITS["FREE"];
}

/**
 * Pre-checks if the guild has reached the maximum allowed count for a specific feature.
 * Returns true if the limit is reached, false otherwise.
 */
export async function isLimitReached(
  guildId: string,
  feature: keyof PlanLimits,
  currentCountQuery: () => Promise<number>
): Promise<boolean> {
  const limits = await getGuildLimits(guildId);
  const currentCount = await currentCountQuery();
  
  return currentCount >= limits[feature];
}
