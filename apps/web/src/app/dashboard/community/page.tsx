import { Users, ExternalLink, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold mb-6 border border-purple-500/20">
          <Users size={16} /> Servidor Oficial
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Junte-se à <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Comunidade Astra</span>
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Faça parte do nosso servidor oficial no Discord para receber suporte em tempo real, testar novidades do beta fechado e conhecer outros criadores de conteúdo e administradores incríveis.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5">
          <ShieldCheck className="w-10 h-10 text-cyan-400 mb-4" />
          <h3 className="font-bold text-xl mb-2">Suporte Prioritário</h3>
          <p className="text-neutral-400 text-sm">Tire dúvidas diretamente com a equipe de desenvolvimento e com nossa equipe de suporte.</p>
        </div>
        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5">
          <Sparkles className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="font-bold text-xl mb-2">Novidades em 1ª Mão</h3>
          <p className="text-neutral-400 text-sm">Saiba antes de todo mundo sobre novos módulos, atualizações e ganhe cargos exclusivos.</p>
        </div>
        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5">
          <Heart className="w-10 h-10 text-pink-400 mb-4" />
          <h3 className="font-bold text-xl mb-2">Comunidade Ativa</h3>
          <p className="text-neutral-400 text-sm">Conheça outros donos de servidores, troque experiências de moderação e engajamento.</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#101524] to-[#1a1325] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <img src="/logo_astra.jpg" alt="Astra Logo" className="w-24 h-24 rounded-2xl shadow-xl shadow-purple-500/20" />
          <div>
            <h2 className="text-2xl font-bold mb-1">Astra HQ</h2>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> 1.2k Online</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-neutral-500"></div> 5.4k Membros</span>
            </div>
          </div>
        </div>
        <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold px-8 py-4 rounded-xl transition-colors w-full md:w-auto shadow-lg shadow-[#5865F2]/20">
          Entrar no Servidor <ExternalLink size={20} />
        </a>
      </div>
    </div>
  );
}
