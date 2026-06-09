"use client";

import { Award, Lock } from "lucide-react";

export default function BadgesPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
          <Award className="text-cyan-400" size={36} /> Insígnias
        </h1>
        <p className="text-neutral-400 text-lg">Exiba suas conquistas no seu cartão de perfil.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-neutral-800 transition-colors group cursor-pointer">
             <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${i <= 3 ? 'bg-cyan-500/20' : 'bg-neutral-800'}`}>
               {i <= 3 ? <Award className="text-cyan-400 w-8 h-8" /> : <Lock className="text-neutral-600 w-6 h-6" />}
             </div>
             <p className={`text-sm font-bold ${i <= 3 ? 'text-white' : 'text-neutral-500'}`}>
               {i === 1 ? 'Beta Tester' : i === 2 ? 'Premium' : i === 3 ? '1 Ano' : 'Bloqueado'}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
}
