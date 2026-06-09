"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Crown, Smartphone, Pickaxe, 
  ShoppingCart, Star, 
  Bell, Layout, Image as ImageIcon, Award, Bookmark, Sliders, Box, Ghost,
  Heart, User
} from "lucide-react";
import { useTranslation } from "@/i18n";

export interface DashboardUser {
  name?: string | null;
  image?: string | null;
}

export function DashboardSidebar({ user }: { user: DashboardUser | null }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="w-72 border-r border-white/5 bg-[#0B0F19] hidden md:flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="p-6 flex justify-center items-center h-24 shrink-0">
         <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
           Astra
         </h1>
      </div>
      
      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-20">
        
        {/* Base Menu */}
        <div className="space-y-1 mb-8">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === "/dashboard" ? "bg-cyan-500/10 text-cyan-400" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}>
            <Home size={18} /> {t("sidebar.servers")}
          </Link>
          <Link href="/dashboard/premium" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname.includes("/premium") ? "bg-cyan-500/10 text-cyan-400" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}>
            <Crown size={18} /> {t("sidebar.premium")}
          </Link>
          <Link href="/dashboard/mobile" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
            <Smartphone size={18} /> {t("sidebar.mobile")}
          </Link>
          <Link href="/dashboard/minecraft" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
            <Pickaxe size={18} /> {t("sidebar.minecraft")}
          </Link>
        </div>

        {/* Sonhos Section */}
        <div className="mb-8">
          <h3 className="px-4 text-xs font-extrabold text-cyan-500 mb-3 tracking-widest uppercase">{t("sidebar.economy")}</h3>
          <div className="space-y-1">
            <Link href="/dashboard/store" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <ShoppingCart size={18} /> {t("sidebar.shop")}
            </Link>
            <Link href="/dashboard/daily" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <Star size={18} /> {t("sidebar.daily")}
            </Link>
          </div>
        </div>

        {/* Personalização Section */}
        <div className="mb-8">
          <h3 className="px-4 text-xs font-extrabold text-cyan-500 mb-3 tracking-widest uppercase">{t("sidebar.personalization")}</h3>
          <div className="space-y-1">
            <Link href="/dashboard/profile/notifications" className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname.includes("/notifications") ? "bg-cyan-500/10 text-cyan-400" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}>
              <div className="flex items-center gap-3"><Bell size={18} /> {t("sidebar.notifications")}</div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NOVO!</span>
            </Link>
            <Link href="/dashboard/profile/layout" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <Layout size={18} /> {t("sidebar.profile_layout")}
            </Link>
            <Link href="/dashboard/profile/background" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <ImageIcon size={18} /> {t("sidebar.profile_bg")}
            </Link>
            <Link href="/dashboard/profile/badges" className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><Award size={18} /> {t("sidebar.badges")}</div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NOVO!</span>
            </Link>
            <Link href="/dashboard/profile/collections" className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><Bookmark size={18} /> {t("sidebar.collections")}</div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NOVO!</span>
            </Link>
            <Link href="/dashboard/profile/presets" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <Sliders size={18} /> {t("sidebar.presets")}
            </Link>
            <Link href="/dashboard/profile/shop" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <Box size={18} /> {t("sidebar.cosmetics")}
            </Link>
            <Link href="/dashboard/profile/pets" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <Ghost size={18} /> {t("sidebar.pets")}
            </Link>
          </div>
        </div>

        {/* Miscelânea Section */}
        <div className="mb-4">
          <h3 className="px-4 text-xs font-extrabold text-cyan-500 mb-3 tracking-widest uppercase">{t("sidebar.misc")}</h3>
          <div className="space-y-1">
            <Link href="/dashboard/misc/ship" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <Heart size={18} /> {t("sidebar.ship")}
            </Link>
            <Link href="/dashboard/misc/reputation" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <Star size={18} /> {t("sidebar.reputation")}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#101524]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden">
               {user?.image ? (
                 <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white font-bold"><User size={20} /></div>
               )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">{user?.name || "Usuário"}</span>
              <span className="text-xs text-neutral-500 leading-tight">@username</span>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors flex items-center gap-1">
            Tema
          </button>
        </div>
      </div>
    </aside>
  );
}
