import { auth } from "@/auth";
import { prisma } from "@astra/db";
import { ServerList } from "@/components/dashboard/ServerList";

export default async function DashboardPage() {
  const session = await auth();
  
  // No mundo real, faríamos um fetch na API do Discord para pegar as guilds do usuário
  // e comparar com as do banco para ver quais têm a Astra instalada.
  // Para MVP, vamos mockar uma lista que mistura instalados e não instalados.

  const dbGuilds = await prisma.guild.findMany({
    where: {
      ownerId: session?.user?.id || "mock-id",
    },
    include: { settings: true }
  });

  // Convert DB guilds to UI format
  const installedGuilds = dbGuilds.map((g: any) => ({
    id: g.id,
    name: g.name,
    role: "Dono",
    isInstalled: true,
  }));

  // Mock some uninstalled guilds for demonstration
  const mockGuilds = [
    { id: "101", name: "Servidor de Testes", role: "Admin", isInstalled: false },
    { id: "102", name: "Comunidade da Astra", role: "Admin", isInstalled: false },
  ];

  const allGuilds = [...installedGuilds, ...mockGuilds];

  return (
    <div className="pt-12 pb-24 px-6 md:px-12 relative w-full">
         <div className="relative z-10 w-full">
           <ServerList guilds={allGuilds} />
         </div>
    </div>
  );
}
