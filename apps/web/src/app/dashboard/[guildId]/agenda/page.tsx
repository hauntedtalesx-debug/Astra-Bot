import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

const DAYS_OF_WEEK = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export default async function AgendaPage({ params }: { params: { guildId: string } }) {
  const session = await auth();
  if (!session || !session.user) return notFound();

  const events = await prisma.creatorSchedule.findMany({
    where: { guildId: params.guildId },
    orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
  });

  const grouped: Record<number, typeof events> = {};
  for (const e of events) {
    if (!grouped[e.dayOfWeek]) grouped[e.dayOfWeek] = [];
    grouped[e.dayOfWeek].push(e);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Agenda do Criador</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DAYS_OF_WEEK.map((dayName, idx) => (
          <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30 flex flex-col h-full">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 border-b border-gray-700 pb-2">{dayName}</h3>
            
            {!grouped[idx] ? (
              <p className="text-gray-500 italic">Livre</p>
            ) : (
              <ul className="space-y-3">
                {grouped[idx].map(event => (
                  <li key={event.id} className="bg-gray-700 p-3 rounded">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{event.title}</span>
                      <span className="text-xs px-2 py-1 bg-gray-900 rounded text-cyan-300">{event.time}</span>
                    </div>
                    {event.isLive && <span className="text-xs px-2 py-0.5 mt-2 inline-block bg-red-600 rounded text-white">🔴 Ao Vivo</span>}
                    {event.description && <p className="text-sm text-gray-400 mt-2">{event.description}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
