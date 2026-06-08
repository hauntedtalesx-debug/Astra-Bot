import { auth } from "@/auth";
import { prisma } from "@astra/db";
import Link from "next/link";
import { Settings } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  
  // No mundo real, faríamos um fetch na API do Discord para pegar as guilds do usuário.
  // Para este MVP, vamos buscar do banco de dados quais guilds este usuário é dono (ownerId).
  const guilds = await prisma.guild.findMany({
    where: {
      ownerId: session?.user?.id || "mock-id", // mock para dev sem auth
    },
    include: { settings: true }
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Seus Servidores</h2>
          <p className="text-neutral-400">Selecione um servidor para gerenciar as configurações da Astra.</p>
        </div>
        <Link href="https://discord.com/oauth2/authorize" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
          Adicionar Astra
        </Link>
      </div>

      {guilds.length === 0 ? (
        <div className="p-12 border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center bg-neutral-900/20">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
            <Settings size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Nenhum servidor encontrado</h3>
          <p className="text-neutral-400 max-w-md mb-6">
            Você não tem a Astra instalada em nenhum servidor onde você é administrador.
          </p>
          <Link href="https://discord.com/oauth2/authorize" className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors">
            Adicionar ao seu servidor
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guilds.map(guild => (
            <Link href={`/dashboard/${guild.id}`} key={guild.id} className="p-6 border border-white/5 rounded-2xl bg-neutral-900/30 hover:border-purple-500/30 hover:bg-neutral-900/50 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-lg group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                  {guild.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold truncate">{guild.name}</h3>
                  <span className="text-xs text-neutral-500">{guild.settings?.planId ? 'Pro/Creator' : 'Free Plan'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-neutral-400">
                <span>{guild.settings?.niche || 'Geral'}</span>
                <span className="flex items-center gap-1 text-purple-400 font-medium">Configurar <Settings size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
