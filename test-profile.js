import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.userProfile.findMany();
  console.log("Perfis no banco de dados:", profiles);
}

main().catch(console.error).finally(() => prisma.$disconnect());
