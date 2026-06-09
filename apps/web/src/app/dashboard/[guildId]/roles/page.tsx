import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function RolesPage({ params }: { params: { guildId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return notFound();

  const roles = await prisma.autoRole.findMany({
    where: { guildId: params.guildId },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Auto Roles</h1>
      
      {roles.length === 0 ? (
        <p className="text-gray-400">Nenhum cargo configurado no painel. Use o comando /roles adicionar no Discord.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <div key={role.id} className="bg-gray-800 p-6 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600/20 text-purple-400 p-2 rounded-lg">
                  🎭
                </div>
                <h3 className="text-xl font-bold text-white">{role.name}</h3>
              </div>
              <div className="text-sm text-gray-400 mb-2">Role ID: <code className="bg-gray-900 px-1 rounded">{role.roleId}</code></div>
              {role.description && <p className="text-gray-300 mt-2">{role.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
