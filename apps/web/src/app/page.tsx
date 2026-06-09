"use client";

import Link from 'next/link';
import { Bot, MessageSquare, BarChart3, HelpCircle, ArrowRight, ShieldCheck, Video, ShoppingCart } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { DiscordMessage, DiscordEmbed } from '@/components/DiscordEmbed';
import { useState } from 'react';

export default function LandingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'engage' | 'mod' | 'admin'>('engage');

  const CLIENT_ID = "1513637418102685716";
  const OAUTH_LINK = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot+applications.commands`;

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-8 border border-purple-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                {t.hero.status}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                {t.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{t.hero.title_highlight}</span>
              </h1>
              <p className="text-xl text-neutral-400 mb-10 leading-relaxed max-w-2xl">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <a href={OAUTH_LINK} className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25">
                  <Bot size={20} /> {t.hero.add_bot}
                </a>
                <a href="#features" className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors">
                  {t.hero.learn_more}
                </a>
              </div>
            </div>
            
            {/* Mascot Image */}
            <div className="flex-1 flex justify-center items-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10"></div>
              <img 
                src="/astra_mascot.png" 
                alt="Astra Mascot" 
                className="w-full max-w-md animate-[bounce_4s_infinite] drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-neutral-900/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                <AnimatedCounter value={1250} />+
              </div>
              <div className="text-neutral-400 font-medium">{t.stats.servers}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                <AnimatedCounter value={350000} />+
              </div>
              <div className="text-neutral-400 font-medium">{t.stats.members}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                <AnimatedCounter value={5000000} />+
              </div>
              <div className="text-neutral-400 font-medium">{t.stats.commands}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.features.title}</h2>
            <p className="text-lg text-neutral-400">{t.features.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.features.f1_title}</h3>
              <p className="text-neutral-400 leading-relaxed">{t.features.f1_desc}</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.features.f2_title}</h3>
              <p className="text-neutral-400 leading-relaxed">{t.features.f2_desc}</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-green-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.features.f3_title}</h3>
              <p className="text-neutral-400 leading-relaxed">{t.features.f3_desc}</p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-red-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.features.f4_title}</h3>
              <p className="text-neutral-400 leading-relaxed">{t.features.f4_desc}</p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-pink-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <Video size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.features.f5_title}</h3>
              <p className="text-neutral-400 leading-relaxed">{t.features.f5_desc}</p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-yellow-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                <ShoppingCart size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.features.f6_title}</h3>
              <p className="text-neutral-400 leading-relaxed">{t.features.f6_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="py-24 border-t border-white/5 bg-[#36393f]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.showcase.title}</h2>
            <p className="text-lg text-[#dcddde]">{t.showcase.subtitle}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-[#2f3136] rounded-lg w-fit mx-auto">
              {(Object.keys(t.showcase.tabs) as Array<'engage' | 'mod' | 'admin'>).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-[#4f545c] text-white' 
                      : 'text-[#b9bbbe] hover:bg-[#4f545c]/50 hover:text-white'
                  }`}
                >
                  {t.showcase.tabs[tab]}
                </button>
              ))}
            </div>

            {/* Discord Mockup */}
            <div className="bg-[#36393f] rounded-lg border border-[#202225] shadow-2xl overflow-hidden">
              <div className="bg-[#202225] p-3 border-b border-[#202225] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ed4245]"></div>
                <div className="w-3 h-3 rounded-full bg-[#fee75c]"></div>
                <div className="w-3 h-3 rounded-full bg-[#57F287]"></div>
                <div className="ml-4 text-xs font-bold text-[#72767d]"># {activeTab === 'engage' ? 'chat-geral' : activeTab === 'mod' ? 'logs' : 'admin'}</div>
              </div>
              <div className="p-2 min-h-[300px]">
                {activeTab === 'engage' && (
                  <>
                    <DiscordMessage avatar="https://cdn.discordapp.com/embed/avatars/1.png" username="MembroAtivo" time="Hoje às 14:30">
                      Como eu ganho mais pontos no servidor?
                    </DiscordMessage>
                    <DiscordMessage avatar="/astra_mascot.png" username="Astra" bot time="Hoje às 14:30">
                      <DiscordEmbed 
                        color="#5865f2"
                        title="⭐ Sistema de Pontos"
                        description="Você ganha pontos ao enviar mensagens e participar de chamadas de voz! Os pontos podem ser trocados por cargos VIPs ou itens exclusivos usando `/loja`."
                        fields={[
                          { name: "Mensagem de texto", value: "10-25 XP", inline: true },
                          { name: "Minuto em call", value: "5 XP", inline: true }
                        ]}
                      />
                    </DiscordMessage>
                  </>
                )}

                {activeTab === 'mod' && (
                  <>
                    <DiscordMessage avatar="https://cdn.discordapp.com/embed/avatars/4.png" username="Troll" time="Hoje às 16:45">
                      Entrem no meu servidor grátis nitro!!! http://link-suspeito.com/nitro
                    </DiscordMessage>
                    <DiscordMessage avatar="/astra_mascot.png" username="Astra" bot time="Hoje às 16:45">
                      <DiscordEmbed 
                        color="#ed4245"
                        author={{ name: "Moderação Automática", iconUrl: "/astra_mascot.png" }}
                        description="**Usuário:** Troll\n**Ação:** Mute (1 hora)\n**Motivo:** Envio de link malicioso bloqueado pelo sistema antispam."
                        timestamp
                      />
                    </DiscordMessage>
                  </>
                )}

                {activeTab === 'admin' && (
                  <>
                    <DiscordMessage avatar="https://cdn.discordapp.com/embed/avatars/0.png" username="Dono" time="Hoje às 09:00">
                      /admin config saudacao
                    </DiscordMessage>
                    <DiscordMessage avatar="/astra_mascot.png" username="Astra" bot time="Hoje às 09:00">
                      <div className="mb-2">Painel de configuração aberto! Você também pode configurar tudo pelo painel web.</div>
                      <div className="flex gap-2">
                        <button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">Editar Mensagem</button>
                        <button className="bg-[#4f545c] hover:bg-[#686d73] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">Testar</button>
                      </div>
                    </DiscordMessage>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-24 bg-neutral-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.pricing.title}</h2>
            <p className="text-lg text-neutral-400">{t.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/30">
              <h3 className="text-2xl font-bold mb-2">{t.pricing.free_title}</h3>
              <div className="text-4xl font-bold mb-6">R$ {t.pricing.free_price}<span className="text-lg text-neutral-500 font-normal">{t.pricing.month}</span></div>
              <ul className="space-y-4 mb-8 text-neutral-300">
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> 1 servidor</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> 3 posts automáticos por semana</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Ranking semanal básico</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Até 10 FAQs cadastradas</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-4 rounded-xl bg-white/5 border border-white/10 text-center font-bold hover:bg-white/10 transition-colors">
                {t.pricing.free_btn}
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl border border-purple-500/50 bg-gradient-to-b from-purple-900/20 to-transparent relative shadow-2xl shadow-purple-500/10">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{t.pricing.recommended}</div>
              <h3 className="text-2xl font-bold mb-2 text-purple-400">{t.pricing.pro_title}</h3>
              <div className="text-4xl font-bold mb-6">R$ {t.pricing.pro_price}<span className="text-lg text-neutral-500 font-normal">{t.pricing.month}</span></div>
              <ul className="space-y-4 mb-8 text-neutral-300">
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Posts automáticos diários</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Ranking semanal e mensal</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Relatório semanal da comunidade</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Até 100 FAQs</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Personalização de mensagens</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-center font-bold transition-colors shadow-lg">
                {t.pricing.pro_btn}
              </Link>
            </div>

            {/* Creator */}
            <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/30">
              <h3 className="text-2xl font-bold mb-2">{t.pricing.creator_title}</h3>
              <div className="text-4xl font-bold mb-6">R$ {t.pricing.creator_price}<span className="text-lg text-neutral-500 font-normal">{t.pricing.month}</span></div>
              <ul className="space-y-4 mb-8 text-neutral-300">
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Múltiplos canais</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Relatórios avançados</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Posts ilimitados</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> IA Personalizada</li>
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-purple-400" /> Exportação CSV</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-4 rounded-xl bg-white/5 border border-white/10 text-center font-bold hover:bg-white/10 transition-colors">
                {t.pricing.creator_btn}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-neutral-950 to-purple-950/20">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para transformar seu servidor?</h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">Junte-se a milhares de comunidades que já confiam na Astra para manter o engajamento lá no alto.</p>
          <a href={OAUTH_LINK} className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors shadow-xl shadow-white/10 text-lg">
            <Bot size={24} /> {t.hero.add_bot}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

