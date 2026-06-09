"use client";

import { useEffect, useState } from "react";
import { getEmbedTemplates } from "@/actions/embeds";
import Link from "next/link";
import { LayoutTemplate, ChevronRight, Loader2, PenTool } from "lucide-react";

// Lista fixa de templates para exibição, importado simbolicamente ou fixado:
const TEMPLATE_KEYS = [
  { key: "WELCOME", name: "Boas-Vindas", desc: "Mensagem enviada quando um membro entra." },
  { key: "LIVE_ONLINE", name: "Live Online", desc: "Notificação de início de stream." },
  { key: "YOUTUBE_NEW", name: "Vídeo Novo", desc: "Notificação de vídeo novo no YouTube." },
  { key: "RANKING_WEEKLY", name: "Ranking Semanal", desc: "Resultado do top chatters da semana." },
  { key: "LEVEL_UP", name: "Level Up", desc: "Notificação quando um usuário sobe de nível." },
  { key: "DAILY_REWARD", name: "Recompensa Diária", desc: "Confirmação do /daily." },
  { key: "GIVEAWAY", name: "Sorteios", desc: "Painel de participação em sorteios." },
  { key: "MISSION", name: "Missão Nova", desc: "Aviso de nova missão da comunidade." },
];

export default function EmbedsListPage({ params }: { params: { guildId: string } }) {
  const [customized, setCustomized] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmbedTemplates(params.guildId).then(data => {
      setCustomized(data.map(t => t.templateKey));
      setLoading(false);
    });
  }, [params.guildId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-purple-500" size={48} /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
          <LayoutTemplate className="text-purple-500" size={36} /> Embed Builder
        </h1>
        <p className="text-neutral-400 text-lg">Gerencie e personalize a identidade visual de todas as mensagens automáticas do seu bot Astra.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATE_KEYS.map((tpl) => {
          const isCustom = customized.includes(tpl.key);
          
          return (
            <Link key={tpl.key} href={`/dashboard/${params.guildId}/embeds/${tpl.key}`}>
              <div className="bg-neutral-900/40 border border-white/5 hover:border-purple-500/50 rounded-2xl p-6 transition-all hover:-translate-y-1 group flex flex-col justify-between h-full cursor-pointer">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{tpl.name}</h3>
                    {isCustom ? (
                      <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full font-bold border border-purple-500/30">Customizado</span>
                    ) : (
                      <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-1 rounded-full font-bold">Padrão</span>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm mb-6">{tpl.desc}</p>
                </div>
                
                <div className="flex justify-between items-center text-sm font-semibold text-neutral-500 group-hover:text-white transition-colors">
                  <span className="flex items-center gap-2"><PenTool size={16} /> Editar Design</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform text-purple-500" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
