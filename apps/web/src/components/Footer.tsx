"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { Bot, Twitter, Github, Heart } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/5 bg-neutral-950 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                <Bot size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">Astra</span>
            </Link>
            <p className="text-neutral-400 max-w-sm mb-6 leading-relaxed">
              Sua gerente de comunidade com IA. Mantemos seu Discord ativo, seguro e engajado para você focar no que importa: criar conteúdo.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-purple-500/20 hover:text-purple-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://github.com/hauntedtalesx-debug" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-white/10 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Produto</h4>
            <ul className="flex flex-col gap-4 text-neutral-400">
              <li><Link href="/#planos" className="hover:text-purple-400 transition-colors">{t.nav.premium}</Link></li>
              <li><Link href="/commands" className="hover:text-purple-400 transition-colors">{t.nav.commands}</Link></li>
              <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">{t.nav.dashboard}</Link></li>
              <li><a href={`https://discord.com/oauth2/authorize?client_id=1513637418102685716&permissions=8&scope=bot+applications.commands`} className="hover:text-purple-400 transition-colors">{t.nav.add_bot}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-neutral-400">
              <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-purple-400 transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="/support" className="hover:text-purple-400 transition-colors">{t.footer.support}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Astra Bot. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart size={14} className="text-red-500" /> para a comunidade
          </p>
        </div>
      </div>
    </footer>
  );
}
