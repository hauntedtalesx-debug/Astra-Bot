"use server";

import { auth } from "@/auth";
import { prisma } from "@astra/db";

// Função para buscar o saldo real do usuário
export async function getUserBalance() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  const userId = (session.user as any).discordId;
  if (!userId) return 0;

  const profile = await prisma.userProfile.findUnique({
    where: { userId }
  });

  return profile?.astraCoins || 0;
}

// Função para processar a compra de um item
export async function purchaseItem(itemId: number, price: number, itemName: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Você precisa estar logado." };
  }

  const userId = (session.user as any).discordId;
  if (!userId) {
    return { success: false, error: "Conta do Discord não vinculada." };
  }

  // Busca o perfil atual
  const profile = await prisma.userProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    return { success: false, error: "Perfil não encontrado." };
  }

  if (profile.astraCoins < price) {
    return { success: false, error: "AstraCoins insuficientes para esta compra." };
  }

  try {
    // Deduzir o valor do banco de dados (dentro de uma transação para segurança)
    await prisma.$transaction(async (tx) => {
      // 1. Tira as moedas
      await tx.userProfile.update({
        where: { userId },
        data: {
          astraCoins: { decrement: price }
        }
      });
      
      // 2. Aqui no futuro a gente insere o item no inventário (UserPet, UserBadge, etc)
      // Dependendo do item comprado.
    });

    return { 
      success: true, 
      newBalance: profile.astraCoins - price,
      message: `Você comprou: ${itemName}`
    };
  } catch (err) {
    return { success: false, error: "Erro ao processar a compra. Tente novamente." };
  }
}
