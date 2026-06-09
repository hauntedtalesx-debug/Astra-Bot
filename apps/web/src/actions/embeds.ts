"use server";

import { prisma } from '@astra/db';
import { auth } from '@/auth';

export async function getEmbedTemplate(guildId: string, templateKey: string) {
  const session = await auth();
  if (!session?.user) return null;

  // Em produção, verificar se o usuário é admin da guild.

  const template = await prisma.customEmbedTemplate.findUnique({
    where: { guildId_templateKey: { guildId, templateKey } }
  });

  return template;
}

export async function getEmbedTemplates(guildId: string) {
  const session = await auth();
  if (!session?.user) return [];

  const templates = await prisma.customEmbedTemplate.findMany({
    where: { guildId }
  });

  return templates;
}

export async function saveEmbedTemplate(guildId: string, templateKey: string, data: any) {
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.customEmbedTemplate.upsert({
      where: { guildId_templateKey: { guildId, templateKey } },
      update: {
        title: data.title,
        description: data.description,
        color: data.color,
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl,
        authorName: data.authorName,
        authorIconUrl: data.authorIconUrl,
        footerText: data.footerText,
        footerIconUrl: data.footerIconUrl,
        buttonLabel: data.buttonLabel,
        buttonUrl: data.buttonUrl,
      },
      create: {
        guildId,
        templateKey,
        ...data
      }
    });

    await prisma.auditLog.create({
      data: {
        guildId,
        action: 'EMBED_TEMPLATE_UPDATED',
        details: `Template ${templateKey} editado via Painel.`,
        performedBy: (session.user as any).discordId || session.user.id,
      }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to save template.' };
  }
}

export async function resetEmbedTemplate(guildId: string, templateKey: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.customEmbedTemplate.delete({
      where: { guildId_templateKey: { guildId, templateKey } }
    });

    await prisma.auditLog.create({
      data: {
        guildId,
        action: 'EMBED_TEMPLATE_RESET',
        details: `Template ${templateKey} resetado via Painel.`,
        performedBy: (session.user as any).discordId || session.user.id,
      }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to reset template.' };
  }
}
