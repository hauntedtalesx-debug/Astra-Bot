"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslation } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LogIn, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-purple-500/20">
            A
          </div>
          <span className="text-2xl font-bold tracking-tight">Astra</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/support" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
            {t.nav.support}
          </Link>
          <Link href="/commands" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
            {t.nav.commands}
          </Link>
          <Link href="/#planos" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
            {t.nav.premium}
          </Link>
          
          <div className="w-px h-6 bg-white/10"></div>
          
          <LanguageSwitcher />

          {session ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src={session.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png"} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border-2 border-purple-500/50"
                />
              </button>
              
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-neutral-900 border border-white/10 shadow-lg shadow-black/50 overflow-hidden py-2">
                  <div className="px-4 py-2 border-b border-white/5 mb-2">
                    <p className="text-sm font-bold text-white truncate">{session.user?.name}</p>
                  </div>
                  <Link 
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    {t.nav.dashboard}
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
                  >
                    <LogOut size={16} />
                    {t.nav.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => signIn("discord")}
              className="flex items-center gap-2 text-sm font-medium bg-white text-black px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-colors"
            >
              <LogIn size={18} />
              {t.nav.login}
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 border-b border-white/10 px-6 py-4 flex flex-col gap-4">
          <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 py-2 border-b border-white/5">
            {t.nav.support}
          </Link>
          <Link href="/commands" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 py-2 border-b border-white/5">
            {t.nav.commands}
          </Link>
          <Link href="/#planos" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 py-2 border-b border-white/5">
            {t.nav.premium}
          </Link>
          
          {session ? (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-white">
                <LayoutDashboard size={18} />
                {t.nav.dashboard}
              </Link>
              <button onClick={() => signOut()} className="flex items-center gap-2 py-2 text-red-400 text-left">
                <LogOut size={18} />
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn("discord")}
              className="flex items-center justify-center gap-2 w-full mt-2 text-sm font-medium bg-white text-black px-5 py-3 rounded-xl hover:bg-neutral-200 transition-colors"
            >
              <LogIn size={18} />
              {t.nav.login}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
