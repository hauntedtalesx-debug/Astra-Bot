import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function StickyPage({ params }: { params: { guildId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return notFound();

  const stickies = await prisma.stickyMessage.findMany({
    where: { guildId: params.guildId },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Sticky Messages</h1>
      
      {stickies.length === 0 ? (
        <p className="text-gray-400">Nenhuma mensagem fixada configurada. Use o comando /sticky no Discord.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stickies.map(sticky => (
            <div key={sticky.id} className="bg-gray-800 p-6 rounded-lg border border-indigo-500/30 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded">
                  Canal: {sticky.channelId}
                </span>
                <span className={`w-3 h-3 rounded-full ${sticky.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              
              <div className="bg-gray-900 p-4 rounded text-gray-300 whitespace-pre-wrap flex-grow font-medium text-sm">
                📌 Mensagem Fixada:
                {"\n"}{sticky.messageText}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
