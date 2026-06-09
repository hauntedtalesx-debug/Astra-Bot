"use client";

import Link from 'next/link';
import { Bot, MessageSquare, BarChart3, HelpCircle, ArrowRight, ShieldCheck, Video, ShoppingCart, Star, Zap, Users, LayoutDashboard, Heart, Sparkles } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { DiscordMessage, DiscordEmbed } from '@/components/DiscordEmbed';
import { WaveDivider } from '@/components/WaveDivider';
import { useState, useEffect } from 'react';
import { getAstraStats } from '@/actions/stats';

export default function LandingPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ guilds: 0, members: 0, commands: 0 });
  const [hasRealData, setHasRealData] = useState(false);

  useEffect(() => {
    getAstraStats().then((data) => {
      if (data && data.guilds > 0) {
        setStats({
          guilds: data.guilds,
          members: data.members,
          commands: data.messages 
        });
        setHasRealData(true);
      }
    }).catch(console.error);
  }, []);

  const CLIENT_ID = "1513637418102685716";
  const OAUTH_LINK = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot+applications.commands`;

  return (
    <div className="min-h-screen bg-cosmic-gradient text-white selection:bg-purple-500/30 overflow-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
        {/* Estrelas Fundo */}
        <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            
            {/* Texto Hero */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
                Olá, eu sou a <span className="text-gradient drop-shadow-[0_0_20px_rgba(199,125,255,0.4)]">Astra</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-neutral-300 mb-6">
                Sua assistente cósmica para manter comunidades de Discord vivas, ativas e conectadas.
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed max-w-2xl">
                Astra ajuda streamers e criadores a manterem seus servidores ativos com posts automáticos, ranking de membros, FAQ inteligente, alertas de live, clipes, ideias de shorts, missões e relatórios semanais.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <a href={OAUTH_LINK} className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-gradient font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(157,78,221,0.5)] text-lg">
                  <Bot size={22} /> Adicionar Astra
                </a>
                <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl glass-panel font-bold hover:bg-white/10 transition-colors text-lg border border-purple-500/30">
                  <LayoutDashboard size={22} /> Abrir Painel
                </Link>
                <Link href="/commands" className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors text-lg">
                  Ver Comandos
                </Link>
              </div>
            </div>
            
            {/* Mascote Hero */}
            <div className="flex-1 flex justify-center items-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B19] via-transparent to-transparent z-10"></div>
              <img 
                src="/astra_mascot.png" 
                alt="Astra Mascot" 
                className="w-full max-w-lg animate-float drop-shadow-[0_0_40px_rgba(157,78,221,0.4)] relative z-20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WAVE DIVIDER */}
      <div className="text-[#0A1128]">
        <WaveDivider className="text-[#0A1128]" />
      </div>

      {/* STATS SECTION */}
      <section className="py-12 bg-[#0A1128] relative z-10">
        <div className="container mx-auto px-6">
          {!hasRealData ? (
             <div className="text-center">
               <h3 className="text-2xl font-bold text-gradient mb-2">Beta Público em Desenvolvimento 🚀</h3>
               <p className="text-neutral-400">Junte-se às comunidades que estão ajudando a Astra a crescer!</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                  <AnimatedCounter value={stats.guilds} />+
                </div>
                <div className="text-purple-300 font-medium tracking-wide uppercase text-sm">Servidores Instalados</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                  <AnimatedCounter value={stats.members} />+
                </div>
                <div className="text-purple-300 font-medium tracking-wide uppercase text-sm">Membros Impactados</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-gradient mb-2 drop-shadow-lg">
                  <AnimatedCounter value={stats.commands} />+
                </div>
                <div className="text-purple-300 font-medium tracking-wide uppercase text-sm">Mensagens Processadas</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WAVE DIVIDER (FLIPPED) */}
      <div className="text-[#0A1128]">
        <WaveDivider flip className="text-[#070B19]" />
      </div>

      {/* SECTION 1 - COMUNIDADE VIVA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-cyan-400 text-sm font-bold mb-6">
                <Sparkles size={16} /> Engajamento
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Transforme seu Discord em uma <span className="text-gradient">comunidade viva</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
                Muitos servidores ficam parados quando a live acaba. A Astra mantém a conversa acontecendo mesmo quando você está offline, dando motivos para os membros continuarem interagindo.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl border-l-4 border-l-purple-500">
                  <h4 className="font-bold mb-1">Perguntas automáticas</h4>
                  <p className="text-sm text-neutral-400">Puxe assunto todos os dias.</p>
                </div>
                <div className="glass-panel p-4 rounded-xl border-l-4 border-l-blue-500">
                  <h4 className="font-bold mb-1">Desafios e Missões</h4>
                  <p className="text-sm text-neutral-400">Recompense a participação.</p>
                </div>
                <div className="glass-panel p-4 rounded-xl border-l-4 border-l-pink-500">
                  <h4 className="font-bold mb-1">Ranking semanal</h4>
                  <p className="text-sm text-neutral-400">Quem fala mais no server?</p>
                </div>
                <div className="glass-panel p-4 rounded-xl border-l-4 border-l-cyan-500">
                  <h4 className="font-bold mb-1">Enquetes</h4>
                  <p className="text-sm text-neutral-400">Descubra o que a galera gosta.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
               {/* Simulação de um mini-painel de leaderboard aqui */}
               <div className="glass-panel p-6 rounded-2xl shadow-2xl relative z-10 border border-purple-500/30">
                 <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                   <h3 className="font-bold flex items-center gap-2"><Star className="text-yellow-400" /> Top Membros da Semana</h3>
                 </div>
                 <div className="space-y-4">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 1 ? 'bg-yellow-500 text-black' : i === 2 ? 'bg-neutral-300 text-black' : 'bg-orange-400 text-black'}`}>{i}</div>
                       <div className="w-10 h-10 rounded-full bg-neutral-700"></div>
                       <div className="flex-1">
                         <div className="h-4 bg-neutral-600 rounded w-24 mb-1"></div>
                         <div className="h-3 bg-neutral-700 rounded w-16"></div>
                       </div>
                       <div className="text-purple-400 font-bold">{1000 - (i * 150)} XP</div>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-purple-500/30 blur-[50px] rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - CRIADORES */}
      <section className="py-24 bg-[#0A1128] relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col-reverse md:flex-row-reverse items-center gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-pink-400 text-sm font-bold mb-6">
                <Video size={16} /> Para Streamers
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Feita sob medida para <span className="text-gradient">criadores</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
                Avisar seus fãs sobre novidades consome muito tempo. A Astra faz o trabalho chato para você poder focar na sua live e no seu conteúdo.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0"><Video size={24} /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Alertas Automáticos</h4>
                    <p className="text-neutral-400">Avisa a galera no momento exato em que sua live na Twitch ou Kick começar, ou quando sair vídeo novo no YouTube.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><Bot size={24} /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Ideias de Shorts e Clipes</h4>
                    <p className="text-neutral-400">A comunidade envia os melhores momentos da live e a Astra ajuda a transformar em ideias virais para o TikTok/Reels.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative flex justify-center">
               <img src="/astra_mascot.png" alt="Astra para Criadores" className="w-full max-w-sm drop-shadow-[0_0_30px_rgba(76,201,240,0.3)] -scale-x-100" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - FAQ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 text-center max-w-4xl">
           <h2 className="text-4xl md:text-5xl font-bold mb-6">Astra cuida das <span className="text-gradient">perguntas repetidas</span></h2>
           <p className="text-lg text-neutral-400 mb-12">&quot;Que horas é a live?&quot;, &quot;Qual o seu setup?&quot;, &quot;Posso jogar junto?&quot;. Não aguenta mais responder a mesma coisa? Crie um FAQ inteligente e deixe que a Astra responda automaticamente quando alguém perguntar no chat.</p>
           
           <div className="glass-panel p-2 rounded-2xl max-w-2xl mx-auto text-left">
              <DiscordMessage avatar="https://cdn.discordapp.com/embed/avatars/2.png" username="NovoMembro" time="Hoje às 20:15">
                Alguém sabe qual o setup dele?
              </DiscordMessage>
              <DiscordMessage avatar="/astra_mascot.png" username="Astra" bot time="Hoje às 20:15">
                <DiscordEmbed 
                  color="#9D4EDD"
                  title="🖥️ Setup do Canal"
                  description="**Processador:** AMD Ryzen 9\n**Placa de Vídeo:** RTX 4080\n**Mouse:** Logitech G Pro X\n**Teclado:** Wooting 60HE"
                />
              </DiscordMessage>
           </div>
        </div>
      </section>

      {/* SECTION 5 - PAINEL VISUAL */}
      <section className="py-24 bg-[#0A1128] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Painel visual, <span className="text-gradient">sem complicação</span></h2>
            <p className="text-lg text-neutral-400">Chega de digitar dezenas de comandos confusos para configurar o bot. A Astra possui um dashboard web completo, lindo e intuitivo onde você liga e desliga funções como se fosse um interruptor.</p>
          </div>
          
          <div className="glass-panel rounded-2xl border border-white/10 p-2 shadow-2xl relative mx-auto max-w-5xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-10 bg-black/40 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="mx-auto text-xs font-bold text-neutral-500 tracking-wider">ASTRA DASHBOARD</div>
            </div>
            <div className="mt-10 p-6 flex gap-6 h-[400px]">
               {/* Falso Sidebar */}
               <div className="w-64 border-r border-white/10 pr-6 hidden md:block">
                 <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-purple-600 rounded-xl"></div>
                   <div className="font-bold">Meu Servidor</div>
                 </div>
                 <div className="space-y-2">
                   <div className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg font-medium text-sm">Dashboard</div>
                   <div className="px-4 py-2 text-neutral-400 hover:text-white rounded-lg font-medium text-sm">Módulos</div>
                   <div className="px-4 py-2 text-neutral-400 hover:text-white rounded-lg font-medium text-sm">Boas-vindas</div>
                   <div className="px-4 py-2 text-neutral-400 hover:text-white rounded-lg font-medium text-sm">Live Alerts</div>
                 </div>
               </div>
               {/* Falso Content */}
               <div className="flex-1">
                 <h3 className="text-2xl font-bold mb-6">Módulos</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-purple-500/50 bg-purple-500/10 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg mb-1">Live Alerts</div>
                        <div className="text-sm text-neutral-400">Ativado</div>
                      </div>
                      <div className="w-12 h-6 bg-purple-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                    </div>
                    <div className="border border-white/10 bg-white/5 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg mb-1">Boas-vindas</div>
                        <div className="text-sm text-neutral-500">Desativado</div>
                      </div>
                      <div className="w-12 h-6 bg-neutral-700 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-neutral-400 rounded-full"></div></div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Escolha seu plano cósmico</h2>
            <p className="text-lg text-neutral-400">Comece de graça e faça o upgrade quando sua comunidade decolar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-3xl glass-panel">
              <h3 className="text-2xl font-bold mb-2">Poeira Estelar (Free)</h3>
              <div className="text-4xl font-bold mb-6">Grátis</div>
              <ul className="space-y-4 mb-8 text-neutral-300">
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Posts automáticos limitados</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Ranking básico</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> FAQ básico</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> 1 alerta de Live</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Ideal para testar</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-4 rounded-xl bg-white/5 border border-white/10 text-center font-bold hover:bg-white/10 transition-colors">
                Começar Grátis
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl border border-purple-500 bg-gradient-to-b from-purple-900/40 to-transparent relative shadow-[0_0_30px_rgba(157,78,221,0.2)] transform md:-translate-y-4">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary-gradient px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">Recomendado</div>
              <h3 className="text-2xl font-bold mb-2 text-purple-400">Supernova (Pro)</h3>
              <div className="text-4xl font-bold mb-6">R$ 15<span className="text-lg text-neutral-400 font-normal">/mês</span></div>
              <ul className="space-y-4 mb-8 text-neutral-300">
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Posts diários ilimitados</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Ranking completo c/ relatórios</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Lives e YouTube Alerts</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Sistema de Clipes e Shorts</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Ideal para streamers</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-4 rounded-xl bg-primary-gradient hover:scale-105 text-center font-bold transition-transform shadow-lg">
                Assinar Pro
              </Link>
            </div>

            {/* Creator */}
            <div className="p-8 rounded-3xl glass-panel">
              <h3 className="text-2xl font-bold mb-2">Galáxia (Creator)</h3>
              <div className="text-4xl font-bold mb-6">R$ 35<span className="text-lg text-neutral-400 font-normal">/mês</span></div>
              <ul className="space-y-4 mb-8 text-neutral-300">
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Recursos avançados</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Múltiplas integrações</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Módulos completos e limites maiores</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Prioridade no suporte</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Ideal para comunidades gigantes</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-4 rounded-xl bg-white/5 border border-white/10 text-center font-bold hover:bg-white/10 transition-colors">
                Assinar Creator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ PUBLICA */}
      <section className="py-24 bg-[#0A1128]">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Dúvidas Frequentes</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "A Astra é grátis?", a: "Sim! A maioria das funcionalidades vitais da Astra, como configurações gerais e rankings básicos, são 100% gratuitas para sempre." },
              { q: "Preciso saber programar para usar?", a: "Não! Construímos um painel visual extremamente fácil de usar. É só clicar e ativar as opções." },
              { q: "O bot funciona com Twitch e YouTube?", a: "Sim, os módulos de Alertas de Live e Vídeo se conectam automaticamente à Twitch e ao YouTube." },
              { q: "O projeto está em beta?", a: "Sim! O dashboard web e o bot estão em desenvolvimento contínuo, e nós adoramos receber feedback da comunidade." }
            ].map((faq, i) => (
              <div key={i} className="glass-panel p-6 rounded-xl border border-white/10">
                <h4 className="text-xl font-bold mb-2 text-purple-300">{faq.q}</h4>
                <p className="text-neutral-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
