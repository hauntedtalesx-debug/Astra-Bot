"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, Plus, Star, Search } from "lucide-react";

export interface DashboardGuild {
  id: string;
  name: string;
  role: string;
  isInstalled: boolean;
}

export function ServerList({ guilds }: { guilds: DashboardGuild[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredGuilds = guilds.filter(guild => {
    if (search && !guild.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "installed" && !guild.isInstalled) return false;
    if (filter === "missing" && guild.isInstalled) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold mb-2 text-white">Escolha um servidor</h2>
          <p className="text-neutral-400 text-lg">Configure a Astra nos servidores onde você é administrador.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-neutral-500 font-medium px-4 py-2 bg-white/5 rounded-lg border border-white/5">
             <span className="text-white">{guilds.length}</span> servidores no total
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar servidor por nome..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#070B19] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button onClick={() => setFilter('all')} className={`px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-[#070B19] border border-white/10 text-neutral-400 hover:text-white'}`}>
            Todos
          </button>
          <button onClick={() => setFilter('installed')} className={`px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === 'installed' ? 'bg-purple-600 text-white' : 'bg-[#070B19] border border-white/10 text-neutral-400 hover:text-white'}`}>
            Astra Instalada
          </button>
          <button onClick={() => setFilter('missing')} className={`px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === 'missing' ? 'bg-purple-600 text-white' : 'bg-[#070B19] border border-white/10 text-neutral-400 hover:text-white'}`}>
            Precisa Adicionar
          </button>
        </div>
      </div>

      {filteredGuilds.length === 0 ? (
        <div className="p-12 border border-white/10 rounded-3xl flex flex-col items-center justify-center text-center glass-panel">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
            <Search size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white">Nenhum servidor encontrado</h3>
          <p className="text-neutral-400 max-w-md mb-8 text-lg">
            {search ? `Não encontramos nenhum servidor com o nome "${search}".` : "Você não tem permissão de administrador em nenhum servidor."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGuilds.map((guild: DashboardGuild) => (
            <div key={guild.id} className="p-6 border border-white/10 rounded-3xl glass-panel hover:border-purple-500/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#070B19] border border-white/5 flex items-center justify-center font-bold text-2xl group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors shadow-inner">
                      {guild.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white truncate max-w-[200px]">{guild.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-white/10 rounded text-neutral-300 font-medium">{guild.role}</span>
                        {guild.isInstalled ? (
                           <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded font-medium flex items-center gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Instalada
                           </span>
                        ) : (
                           <span className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded font-medium flex items-center gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-neutral-500"></div> Não Instalada
                           </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-neutral-600 hover:text-yellow-400 transition-colors">
                    <Star size={24} />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                {guild.isInstalled ? (
                  <Link href={`/dashboard/${guild.id}`} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-purple-600 border border-white/10 hover:border-purple-500 rounded-xl font-bold text-white transition-all">
                    <Settings size={18} /> Configurar Astra
                  </Link>
                ) : (
                  <a href={`https://discord.com/oauth2/authorize?client_id=1513637418102685716&permissions=8&scope=bot+applications.commands&guild_id=${guild.id}`} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black hover:bg-neutral-200 rounded-xl font-bold transition-all">
                    <Plus size={18} /> Adicionar Astra
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
