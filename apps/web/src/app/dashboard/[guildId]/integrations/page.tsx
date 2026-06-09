import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function IntegrationsPage({ params }: { params: { guildId: string } }) {
  const session = await auth();
  if (!session || !session.user) return notFound();

  const guildSettings = await prisma.guildSettings.findUnique({
    where: { guildId: params.guildId },
    include: { guild: true }
  });

  if (!guildSettings) return notFound();

  const twitchIntegrations = await prisma.creatorIntegration.findMany({ where: { guildId: params.guildId } });
  const youtubeIntegrations = await prisma.youtubeIntegration.findMany({ where: { guildId: params.guildId } });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Integrações de Criador</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-purple-500/30">
          <h2 className="text-xl font-bold text-purple-400 mb-4">📺 Lives (Twitch/Kick)</h2>
          {twitchIntegrations.length === 0 ? (
            <p className="text-gray-400">Nenhuma live configurada. Use o comando /live no servidor.</p>
          ) : (
            <ul className="space-y-4">
              {twitchIntegrations.map(i => (
                <li key={i.id} className="bg-gray-700 p-4 rounded">
                  <div className="font-bold text-white">{i.creatorUsername} <span className="text-xs px-2 py-1 bg-purple-600 rounded-full">{i.platform}</span></div>
                  <div className="text-sm text-gray-300 mt-2">Canal de aviso: {i.discordChannelId}</div>
                  <div className="text-sm text-gray-400 mt-1">Status: {i.enabled ? '🟢 Ativo' : '🔴 Pausado'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-red-500/30">
          <h2 className="text-xl font-bold text-red-400 mb-4">▶️ YouTube Connect</h2>
          {youtubeIntegrations.length === 0 ? (
            <p className="text-gray-400">Nenhum canal configurado. Use o comando /youtube no servidor.</p>
          ) : (
            <ul className="space-y-4">
              {youtubeIntegrations.map(y => (
                <li key={y.id} className="bg-gray-700 p-4 rounded">
                  <div className="font-bold text-white">{y.youtubeChannelName}</div>
                  <div className="text-sm text-gray-300 mt-2">Canal de aviso: {y.discordChannelId}</div>
                  <div className="text-sm text-gray-400 mt-1">Status: {y.enabled ? '🟢 Ativo' : '🔴 Pausado'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
