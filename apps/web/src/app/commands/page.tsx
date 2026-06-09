import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function CommandsPage() {
  const commands = [
    { name: "/admin", description: "Configurações avançadas do bot, sistema de pontos e módulos.", category: "Admin" },
    { name: "/gerenciar", description: "Moderação do servidor, punições e gerenciamento de chats.", category: "Moderação" },
    { name: "/comunidade", description: "Comandos para interação entre membros, consultar XP e ranking.", category: "Comunidade" },
    { name: "/engajar", description: "Cria enquetes, sorteios, perguntas do dia e mini-games.", category: "Engajamento" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Comandos da Astra</h1>
        <p className="text-neutral-400 mb-12 text-lg">Todos os nossos comandos são organizados em categorias (Slash Commands). Basta digitar <code className="bg-white/10 px-2 py-1 rounded text-purple-400">/</code> no chat para ver a lista completa interativa.</p>
        
        <div className="space-y-6">
          {commands.map((cmd) => (
            <div key={cmd.name} className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-purple-500/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-purple-400">{cmd.name}</h3>
                <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-neutral-300">{cmd.category}</span>
              </div>
              <p className="text-neutral-400">{cmd.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
