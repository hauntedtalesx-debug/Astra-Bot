import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  const plans = [
    {
      name: 'Free',
      price: 0,
      maxFaqs: 10,
      autoPostsPerWeek: 3,
      features: ['1 servidor', '3 posts automáticos por semana', 'ranking semanal básico', 'até 10 FAQs cadastradas'],
    },
    {
      name: 'Pro',
      price: 9.99,
      maxFaqs: 100,
      autoPostsPerWeek: 7, // Diários
      features: ['posts automáticos diários', 'ranking semanal e mensal', 'relatório semanal', 'até 100 FAQs', 'personalização de mensagens'],
    },
    {
      name: 'Creator',
      price: 29.99,
      maxFaqs: 500,
      autoPostsPerWeek: 999, // Ilimitado (na prática)
      features: ['múltiplos canais', 'relatórios avançados', 'posts ilimitados', 'IA personalizada', 'exportação CSV', 'prioridade em recursos futuros'],
    }
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
    console.log(`Upserted plan: ${plan.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
