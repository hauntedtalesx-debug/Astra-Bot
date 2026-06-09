import { prisma } from "@astra/db";
import { notFound } from "next/navigation";
import { MessageSquare, HelpCircle, BarChart3, Settings } from "lucide-react";
import Link from "next/link";

export default async function GuildDashboard({ params }: { params: { guildId: string } }) {
  const guild = await prisma.guild.findUnique({
    where: { id: params.guildId },
    include: {
      settings: true,
      _count: {
        select: { autoPosts: true, faqs: true, members: true }
      }
    }
  });

  if (!guild) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
          {guild.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-3xl font-bold">{guild.name}</h2>
          <p className="text-neutral-400">Nicho: {guild.settings?.niche} | Idioma: {guild.settings?.language}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-neutral-900/30 border border-white/5">
          <div className="text-neutral-400 text-sm mb-2 flex items-center gap-2"><BarChart3 size={16}/> Membros Ativos</div>
          <div className="text-3xl font-bold">{guild._count.members}</div>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-900/30 border border-white/5">
          <div className="text-neutral-400 text-sm mb-2 flex items-center gap-2"><MessageSquare size={16}/> Auto-posts</div>
          <div className="text-3xl font-bold">{guild._count.autoPosts}</div>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-900/30 border border-white/5">
          <div className="text-neutral-400 text-sm mb-2 flex items-center gap-2"><HelpCircle size={16}/> FAQs</div>
          <div className="text-3xl font-bold">{guild._count.faqs}</div>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-900/30 border border-white/5">
          <div className="text-neutral-400 text-sm mb-2 flex items-center gap-2"><Settings size={16}/> Plano Atual</div>
          <div className="text-xl font-bold text-purple-400">{guild.settings?.planId ? 'Premium' : 'Free'}</div>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Gerenciar</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href={`/dashboard/${guild.id}/integrations`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-purple-500/20 group">
          <h4 className="font-bold mb-2 group-hover:text-purple-400 transition-colors">Integrações (Live & YT)</h4>
          <p className="text-sm text-neutral-400">Verifique alertas de live na Twitch e vídeos do YouTube.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/clips`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-blue-500/20 group">
          <h4 className="font-bold mb-2 group-hover:text-blue-400 transition-colors">Central de Clipes</h4>
          <p className="text-sm text-neutral-400">Gerencie clipes enviados pela sua comunidade.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/shorts`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-pink-500/20 group">
          <h4 className="font-bold mb-2 group-hover:text-pink-400 transition-colors">Ideias de Shorts</h4>
          <p className="text-sm text-neutral-400">Acesse seus roteiros e ganchos salvos para gravar depois.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/agenda`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-cyan-500/20 group">
          <h4 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors">Agenda do Criador</h4>
          <p className="text-sm text-neutral-400">Programe seus dias de live e vídeos para a comunidade.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/missions`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-yellow-500/20 group">
          <h4 className="font-bold mb-2 group-hover:text-yellow-400 transition-colors">Missões da Comunidade</h4>
          <p className="text-sm text-neutral-400">Tarefas engajadoras valendo pontos no ranking.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/welcome`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-pink-500/20 group">
          <h4 className="font-bold mb-2 group-hover:text-pink-400 transition-colors">Mensagem de Boas-Vindas</h4>
          <p className="text-sm text-neutral-400">Receba novos membros com estilo e sua identidade visual.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/roles`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-purple-500/20 group">
          <h4 className="font-bold mb-2 group-hover:text-purple-400 transition-colors">Cargos por Interesse</h4>
          <p className="text-sm text-neutral-400">Crie painéis interativos para a comunidade escolher seus interesses.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/giveaways`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-yellow-500/20 group">
          <h4 className="font-bold mb-2 group-hover:text-yellow-400 transition-colors">Sorteios</h4>
          <p className="text-sm text-neutral-400">Gerencie prêmios, tempo e participantes de forma fácil.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/sticky`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-indigo-500/20 group">
          <h4 className="font-bold mb-2 group-hover:text-indigo-400 transition-colors">Sticky Messages</h4>
          <p className="text-sm text-neutral-400">Fixe mensagens importantes na parte inferior do chat.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/posts`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-white/5 group">
          <h4 className="font-bold mb-2 group-hover:text-white transition-colors">Posts Automáticos</h4>
          <p className="text-sm text-neutral-400">Configure enquetes, perguntas e desafios recorrentes.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/faq`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-white/5 group">
          <h4 className="font-bold mb-2 group-hover:text-white transition-colors">FAQ da Comunidade</h4>
          <p className="text-sm text-neutral-400">Cadastre respostas para as perguntas mais comuns.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/ranking`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-white/5 group">
          <h4 className="font-bold mb-2 group-hover:text-green-400 transition-colors">Ranking e Membros</h4>
          <p className="text-sm text-neutral-400">Veja quem são os usuários mais ativos do servidor.</p>
        </Link>
        <Link href={`/dashboard/${guild.id}/settings`} className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800 transition-colors border border-white/5 group">
          <h4 className="font-bold mb-2 group-hover:text-yellow-400 transition-colors">Configurações</h4>
          <p className="text-sm text-neutral-400">Altere canais, nicho, links de redes sociais e logs.</p>
        </Link>
      </div>
    </div>
  );
}
