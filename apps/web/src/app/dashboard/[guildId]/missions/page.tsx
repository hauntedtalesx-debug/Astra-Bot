import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function MissionsPage({ params }: { params: { guildId: string } }) {
  const session = await auth();
  if (!session || !session.user) return notFound();

  const missions = await prisma.communityMission.findMany({
    where: { guildId: params.guildId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Missões da Comunidade</h1>
      
      {missions.length === 0 ? (
        <p className="text-gray-400">Nenhuma missão configurada no servidor.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map(mission => (
            <div key={mission.id} className={`p-6 rounded-lg border flex flex-col h-full ${mission.active ? 'bg-gray-800 border-yellow-500/50' : 'bg-gray-900 border-gray-700/50 opacity-60'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-yellow-400">{mission.title}</h3>
                <span className={`text-xs px-2 py-1 rounded font-bold ${mission.active ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {mission.active ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              
              <div className="flex-grow text-gray-300 mb-4">
                {mission.description}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🏆</span>
                  <span className="font-bold text-white">{mission.points} Pontos</span>
                </div>
                {mission.reward && (
                  <div className="text-sm text-yellow-200 bg-yellow-900/30 p-2 rounded">
                    <strong>Bônus:</strong> {mission.reward}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
