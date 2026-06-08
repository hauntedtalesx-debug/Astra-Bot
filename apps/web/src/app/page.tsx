import Link from 'next/link';
import { Bot, MessageSquare, BarChart3, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30">
      
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">A</div>
          <span className="text-xl font-bold tracking-tight">Astra</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-neutral-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="https://discord.com/oauth2/authorize" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
            Adicionar ao Discord
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-8 border border-purple-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Astra já está online
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-8 leading-tight">
          Astra mantém sua comunidade ativa <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">mesmo quando você está offline.</span>
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed">
          Seu Discord morre quando a live acaba? A Astra é sua gerente de comunidade automatizada. Posts automáticos, ranking de engajamento, relatórios semanais e FAQ inteligente.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="https://discord.com/oauth2/authorize" className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 font-medium hover:opacity-90 transition-opacity">
            Adicionar ao Discord <ArrowRight size={18} />
          </Link>
          <Link href="#planos" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 font-medium hover:bg-white/10 transition-colors">
            Ver Planos
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/5 bg-neutral-900/50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Como a Astra funciona?</h2>
            <p className="text-neutral-400">Tudo o que você precisa para uma comunidade engajada e auto-sustentável.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-950 border border-white/5 hover:border-purple-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare />
              </div>
              <h3 className="text-xl font-bold mb-3">Posts Automáticos</h3>
              <p className="text-neutral-400 leading-relaxed">Astra faz perguntas do dia, enquetes e desafios para os membros interagirem todos os dias.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-neutral-950 border border-white/5 hover:border-blue-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 />
              </div>
              <h3 className="text-xl font-bold mb-3">Ranking de Atividade</h3>
              <p className="text-neutral-400 leading-relaxed">Identifique e recompense os membros mais ativos com um sistema anti-spam inteligente integrado.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-neutral-950 border border-white/5 hover:border-green-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
                <HelpCircle />
              </div>
              <h3 className="text-xl font-bold mb-3">FAQ Inteligente</h3>
              <p className="text-neutral-400 leading-relaxed">Sua comunidade pode fazer perguntas para a Astra e ela responde com base no que você cadastrou.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Planos que cabem no seu bolso</h2>
          <p className="text-neutral-400">Comece de graça e evolua conforme sua comunidade cresce.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/30">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-6">R$ 0<span className="text-lg text-neutral-500 font-normal">/mês</span></div>
            <ul className="space-y-4 mb-8 text-neutral-300">
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> 1 servidor</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> 3 posts automáticos por semana</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Ranking semanal básico</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Até 10 FAQs cadastradas</li>
            </ul>
            <Link href="/dashboard" className="block w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center font-medium hover:bg-white/10 transition-colors">
              Começar Grátis
            </Link>
          </div>

          {/* Pro */}
          <div className="p-8 rounded-3xl border border-purple-500/50 bg-gradient-to-b from-purple-900/20 to-transparent relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-1 rounded-full text-xs font-bold">RECOMENDADO</div>
            <h3 className="text-2xl font-bold mb-2 text-purple-400">Pro</h3>
            <div className="text-4xl font-bold mb-6">R$ 9,90<span className="text-lg text-neutral-500 font-normal">/mês</span></div>
            <ul className="space-y-4 mb-8 text-neutral-300">
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Posts automáticos diários</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Ranking semanal e mensal</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Relatório semanal da comunidade</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Até 100 FAQs</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Personalização de mensagens</li>
            </ul>
            <Link href="/dashboard" className="block w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-center font-medium transition-colors">
              Assinar Pro
            </Link>
          </div>

          {/* Creator */}
          <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/30">
            <h3 className="text-2xl font-bold mb-2">Creator</h3>
            <div className="text-4xl font-bold mb-6">R$ 29,90<span className="text-lg text-neutral-500 font-normal">/mês</span></div>
            <ul className="space-y-4 mb-8 text-neutral-300">
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Múltiplos canais</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Relatórios avançados</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Posts ilimitados</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> IA Personalizada</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Exportação CSV</li>
            </ul>
            <Link href="/dashboard" className="block w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center font-medium hover:bg-white/10 transition-colors">
              Assinar Creator
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center font-bold text-white text-xs">A</div>
            <span className="font-semibold">Astra Bot</span>
          </div>
          <div className="flex gap-6 text-sm text-neutral-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="https://discord.gg/astra" className="hover:text-white transition-colors">Suporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
