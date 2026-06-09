import { prisma } from "@astra/db";

export enum AuditLogAction {
  SETUP_UPDATED = "SETUP_UPDATED",
  LIVE_CONNECTED = "LIVE_CONNECTED",
  LIVE_REMOVED = "LIVE_REMOVED",
  YOUTUBE_CONNECTED = "YOUTUBE_CONNECTED",
  YOUTUBE_REMOVED = "YOUTUBE_REMOVED",
  CLIP_APPROVED = "CLIP_APPROVED",
  CLIP_REJECTED = "CLIP_REJECTED",
  CLIP_FEATURED = "CLIP_FEATURED",
  CLIP_SETTINGS_UPDATED = "CLIP_SETTINGS_UPDATED",
  SHORT_IDEA_SAVED = "SHORT_IDEA_SAVED",
  GIVEAWAY_CREATED = "GIVEAWAY_CREATED",
  RANKING_RESET = "RANKING_RESET",
  DATA_DELETED = "DATA_DELETED",
  AUTOPOST_CREATED = "AUTOPOST_CREATED",
  AUTOPOST_REMOVED = "AUTOPOST_REMOVED",
  AUTOPOST_PAUSED = "AUTOPOST_PAUSED",
  AUTOPOST_RESUMED = "AUTOPOST_RESUMED",
}

export async function logAudit(
  guildId: string,
  userId: string,
  action: AuditLogAction,
  metadata?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        guildId,
        userId,
        action,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error(`Failed to create audit log for ${action} in guild ${guildId}:`, error);
  }
}
