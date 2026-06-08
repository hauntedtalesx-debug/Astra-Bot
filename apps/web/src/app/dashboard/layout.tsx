import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, MessageSquare, HelpCircle, ArrowLeft } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    // Para simplificar no MVP, forçamos o "login" visual se não tiver auth
    // redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-neutral-900/20 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">A</div>
          <span className="font-bold text-lg">Astra Dash</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 text-purple-400 font-medium">
            <LayoutDashboard size={20} />
            Meus Servidores
          </Link>
          {/* Outros links apareceriam ao selecionar um servidor */}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800"></div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{session?.user?.name || "Admin"}</div>
              <div className="text-xs text-neutral-500 truncate">Pro Plan</div>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 mt-4 text-xs text-neutral-500 hover:text-white px-4">
            <ArrowLeft size={14} /> Voltar ao site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 border-b border-white/5 flex items-center px-8 bg-neutral-950/50 backdrop-blur sticky top-0 z-10">
          <h1 className="text-lg font-medium">Painel de Controle</h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
