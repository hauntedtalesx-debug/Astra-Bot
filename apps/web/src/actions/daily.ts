"use server";

import { auth } from "@/auth";
import { prisma } from "@astra/db";

export async function claimDailyReward() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: "Você precisa estar logado." };
  }

  const userId = session.user.id;

  // Busca o perfil do usuário (ou cria se não existir)
  let profile = await prisma.userProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    profile = await prisma.userProfile.create({
      data: { userId }
    });
  }

  const now = new Date();
  const lastDaily = profile.lastDailyAt;
  
  // Verifica se já pegou hoje (Cooldown de 24h)
  if (lastDaily) {
    const timeDiff = now.getTime() - lastDaily.getTime();
    const hoursSinceLastDaily = timeDiff / (1000 * 60 * 60);
    
    if (hoursSinceLastDaily < 24) {
      const remainingTime = Math.ceil(24 - hoursSinceLastDaily);
      return { 
        success: false, 
        error: `Você já resgatou hoje! Volte em ${remainingTime} hora(s).` 
      };
    }
  }

  // Lógica de Streak
  let newStreak = profile.dailyStreak + 1;
  let multiplier = 1.0;

  // Se passou mais de 48 horas desde o último daily, perde a ofensiva
  if (lastDaily) {
    const timeDiff = now.getTime() - lastDaily.getTime();
    const hoursSinceLastDaily = timeDiff / (1000 * 60 * 60);
    if (hoursSinceLastDaily > 48) {
      newStreak = 1;
    }
  }

  // Aumenta multiplicador baseado na streak (Max 2.0x aos 10 dias)
  if (newStreak >= 2) multiplier = 1.1;
  if (newStreak >= 5) multiplier = 1.5;
  if (newStreak >= 10) multiplier = 2.0;

  // Recompensa base
  const baseReward = Math.floor(Math.random() * 200) + 100; // Entre 100 e 300
  const finalReward = Math.floor(baseReward * multiplier);

  // Atualiza banco de dados
  await prisma.userProfile.update({
    where: { userId },
    data: {
      astraCoins: { increment: finalReward },
      lastDailyAt: now,
      dailyStreak: newStreak
    }
  });

  return { 
    success: true, 
    reward: finalReward, 
    streak: newStreak, 
    multiplier 
  };
}

export async function getDailyStatus() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile) return null;

  const now = new Date();
  const lastDaily = profile.lastDailyAt;
  
  let canClaim = true;
  let hoursRemaining = 0;
  
  if (lastDaily) {
    const timeDiff = now.getTime() - lastDaily.getTime();
    const hoursSinceLastDaily = timeDiff / (1000 * 60 * 60);
    if (hoursSinceLastDaily < 24) {
      canClaim = false;
      hoursRemaining = Math.ceil(24 - hoursSinceLastDaily);
    }
  }

  return {
    canClaim,
    hoursRemaining,
    streak: profile.dailyStreak,
    coins: profile.astraCoins
  };
}
