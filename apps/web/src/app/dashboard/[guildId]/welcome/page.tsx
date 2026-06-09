import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function WelcomePage({ params }: { params: { guildId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return notFound();

  const welcome = await prisma.welcomeMessage.findUnique({
    where: { guildId: params.guildId },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Boas-Vindas Personalizadas</h1>
      
      {!welcome ? (
        <p className="text-gray-400">Nenhuma mensagem de boas-vindas configurada. Use o comando /welcome no servidor para começar.</p>
      ) : (
        <div className="bg-gray-800 p-8 rounded-lg max-w-2xl border border-pink-500/50">
          <div className="mb-6 border-b border-gray-700 pb-4">
            <h3 className="text-sm font-bold text-gray-400 mb-1">Canal de Envio</h3>
            <div className="text-lg text-white">ID: {welcome.channelId}</div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-2">Pré-visualização do Texto</h3>
            <div className="bg-gray-900 p-4 rounded text-gray-300 whitespace-pre-wrap font-medium">
              {welcome.messageText}
            </div>
            <p className="text-xs text-gray-500 mt-2">*As tags {"{user}"} e {"{server}"} serão substituídas automaticamente pelo bot.</p>
          </div>

          {welcome.imageUrl && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-2">Imagem Anexada</h3>
              <div className="bg-gray-900 p-2 rounded inline-block">
                <img src={welcome.imageUrl} alt="Welcome Banner" className="max-w-full h-auto max-h-64 rounded object-contain" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
