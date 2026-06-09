import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function ClipsPage({ params }: { params: { guildId: string } }) {
  const session = await auth();
  if (!session || !session.user) return notFound();

  const clips = await prisma.clipSubmission.findMany({
    where: { guildId: params.guildId },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Central de Clipes</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        {clips.length === 0 ? (
          <p className="text-gray-400">Nenhum clipe enviado pela comunidade ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-3">Usuário</th>
                  <th className="py-3">URL</th>
                  <th className="py-3">Descrição</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {clips.map(clip => (
                  <tr key={clip.id} className="border-b border-gray-700">
                    <td className="py-3">@{clip.username}</td>
                    <td className="py-3"><a href={clip.url} target="_blank" className="text-blue-400 hover:underline">Abrir Link</a></td>
                    <td className="py-3">{clip.description || "-"}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${clip.status === 'PENDING' ? 'bg-yellow-600' : clip.status === 'APPROVED' ? 'bg-green-600' : clip.status === 'FEATURED' ? 'bg-purple-600' : 'bg-red-600'}`}>
                        {clip.status}
                      </span>
                    </td>
                    <td className="py-3">{new Date(clip.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
