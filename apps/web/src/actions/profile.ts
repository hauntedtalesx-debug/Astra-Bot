"use server";

import { auth } from "@/auth";
import { prisma } from "@astra/db";

// Busca os dados de personalização do usuário
export async function getProfileSettings() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = (session.user as any).discordId;
  if (!userId) return null;

  let profile = await prisma.userProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    profile = await prisma.userProfile.create({
      data: { userId }
    });
  }

  return {
    layoutId: profile.layoutId,
    backgroundUrl: profile.backgroundUrl,
    presetId: profile.presetId
  };
}

// Atualiza o layout escolhido
export async function updateLayout(layoutId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não logado" };

  const userId = (session.user as any).discordId;
  if (!userId) return { success: false, error: "Sem Discord ID" };

  await prisma.userProfile.update({
    where: { userId },
    data: { layoutId }
  });

  return { success: true };
}

// Atualiza o fundo (background) escolhido
export async function updateBackground(backgroundUrl: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não logado" };

  const userId = (session.user as any).discordId;
  if (!userId) return { success: false, error: "Sem Discord ID" };

  await prisma.userProfile.update({
    where: { userId },
    data: { backgroundUrl }
  });

  return { success: true };
}
