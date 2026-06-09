import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ShortsPage({ params }: { params: { guildId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return notFound();

  const shorts = await prisma.shortIdea.findMany({
    where: { guildId: params.guildId },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Ideias de Shorts Salvas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shorts.length === 0 ? (
          <p className="text-gray-400 col-span-3">Nenhuma ideia salva. Use o comando /shorts ideia no servidor!</p>
        ) : (
          shorts.map(short => (
            <div key={short.id} className="bg-gray-800 p-6 rounded-lg border border-pink-500/30 flex flex-col h-full">
              <h3 className="text-xl font-bold text-pink-400 mb-2">{short.title}</h3>
              <div className="mb-4 text-sm text-gray-400">
                <span className="font-bold text-white">Nicho:</span> {short.niche || "Variedades"}
              </div>
              <div className="mb-4 flex-grow">
                <div className="text-sm font-bold text-gray-300 mb-1">Gancho:</div>
                <div className="text-sm text-gray-400 italic bg-gray-900 p-2 rounded border border-gray-700">"{short.hook}"</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-300 mb-1">Roteiro:</div>
                <p className="text-sm text-gray-400 whitespace-pre-wrap">{short.script}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
                Criado em: {new Date(short.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
