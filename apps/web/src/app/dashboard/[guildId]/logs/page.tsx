import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function LogsPage({ params }: { params: { guildId: string } }) {
  const session = await auth();
  if (!session || !session.user) return notFound();

  const logs = await prisma.auditLog.findMany({
    where: { guildId: params.guildId },
    orderBy: { createdAt: 'desc' },
    take: 50 // Show last 50
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Logs Avançados</h1>
      
      {logs.length === 0 ? (
        <p className="text-gray-400">Nenhum evento registrado no servidor.</p>
      ) : (
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700/50 flex justify-between items-center transition hover:border-gray-500">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  log.action.includes('TICKET') ? 'bg-blue-500/20 text-blue-400' :
                  log.action.includes('STORE') ? 'bg-green-500/20 text-green-400' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {log.action.includes('OPENED') ? '🎫' : log.action.includes('CLOSED') ? '🔒' : log.action.includes('PURCHASE') ? '🛒' : '📝'}
                </div>
                <div>
                  <h4 className="text-white font-bold">{log.action}</h4>
                  <p className="text-sm text-gray-400">Usuário: <code className="bg-gray-900 px-1 rounded">{log.userId}</code></p>
                  {log.metadata && (
                    <p className="text-xs text-gray-500 mt-1">{log.metadata}</p>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
