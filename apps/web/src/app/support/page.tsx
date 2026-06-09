import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExternalLink, MessageCircleQuestion } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Navbar />
      <div className="pt-32 pb-24 container mx-auto px-6 max-w-3xl flex-1">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
          <MessageCircleQuestion size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Precisa de ajuda?</h1>
        <p className="text-neutral-400 mb-12 text-lg">
          Estamos aqui para ajudar você a configurar a Astra e tirar o máximo de proveito na sua comunidade.
        </p>

        <h2 className="text-2xl font-bold mb-4">Ainda precisa de ajuda?</h2>
        <p className="text-neutral-400 mb-6">
          Nossa equipe e a comunidade estão sempre prontas para ajudar. Junte-se ao nosso servidor oficial e abra um ticket ou tire suas dúvidas no canal &quot;suporte-geral&quot;.
        </p>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 mb-8">
          <h2 className="text-2xl font-bold mb-2">Comunidade no Discord</h2>
          <p className="text-neutral-300 mb-6">A forma mais rápida de obter suporte é entrando no nosso servidor oficial. Nossa equipe e outros administradores estão lá para ajudar.</p>
          <a 
            href="https://discord.gg/astra" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Entrar no Servidor <ExternalLink size={18} />
          </a>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold mt-12 mb-4">Dúvidas Frequentes</h2>
          
          <details className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 group cursor-pointer">
            <summary className="font-semibold text-lg flex items-center justify-between">
              Como configuro o ranking de XP?
              <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-neutral-400 mt-4 leading-relaxed">
              Vá até o Dashboard, selecione seu servidor e clique em &quot;Engajamento&quot;. Lá você pode ativar o ranking, definir quantos pontos por mensagem e criar recompensas (cargos).
            </p>
          </details>

          <details className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 group cursor-pointer">
            <summary className="font-semibold text-lg flex items-center justify-between">
              A Astra é 100% gratuita?
              <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-neutral-400 mt-4 leading-relaxed">
              Temos um plano gratuito generoso que atende a maioria das comunidades iniciais. Para servidores maiores ou que precisam de recursos avançados como loja customizada e relatórios semanais, oferecemos planos Premium muito acessíveis.
            </p>
          </details>
        </div>
      </div>
      <Footer />
    </div>
  );
}
