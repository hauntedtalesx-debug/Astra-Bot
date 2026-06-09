"use client";

import { Sliders, Paintbrush } from "lucide-react";

export default function PresetsPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
          <Sliders className="text-yellow-400" size={36} /> Predefinições
        </h1>
        <p className="text-neutral-400 text-lg">Aplique temas prontos ao seu perfil com um único clique.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-colors cursor-pointer group">
             <div className={`h-24 ${i % 2 === 0 ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-pink-500 to-orange-500'} relative`}>
               <div className="absolute -bottom-6 left-6 w-12 h-12 bg-neutral-800 rounded-full border-2 border-neutral-900"></div>
             </div>
             <div className="p-6 pt-8">
               <h3 className="font-bold text-lg mb-1">Tema {i}</h3>
               <p className="text-sm text-neutral-400 mb-4">Cores, fonte e fundo aplicados automaticamente.</p>
               <button className="w-full bg-neutral-800 hover:bg-yellow-400 hover:text-black font-bold py-2 rounded-lg transition-colors text-sm">
                 Aplicar
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
