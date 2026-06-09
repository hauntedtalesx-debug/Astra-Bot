import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function GiveawaysPage({ params }: { params: { guildId: string } }) {
  const session = await auth();
  if (!session || !session.user) return notFound();

  const giveaways = await prisma.giveaway.findMany({
    where: { guildId: params.guildId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Sorteios da Comunidade</h1>
      
      {giveaways.length === 0 ? (
        <p className="text-gray-400">Nenhum sorteio foi realizado neste servidor ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giveaways.map(g => (
            <div key={g.id} className={`p-6 rounded-lg border ${g.active ? 'bg-gray-800 border-yellow-500/50' : 'bg-gray-900 border-gray-700/50 opacity-70'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-yellow-400">{g.prize}</h3>
                <span className={`text-xs px-2 py-1 rounded font-bold ${g.active ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {g.active ? 'Ativo' : 'Encerrado'}
                </span>
              </div>
              
              <div className="text-sm text-gray-300 mb-4 space-y-2">
                <p><strong>Vencedores:</strong> {g.winnersCount}</p>
                <p><strong>Término:</strong> {new Date(g.endAt).toLocaleString()}</p>
              </div>
              
              {g.description && (
                <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
                  {g.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
