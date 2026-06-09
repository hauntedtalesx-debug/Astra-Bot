"use client";

import { Bookmark, Star } from "lucide-react";

export default function CollectionsPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
          <Bookmark className="text-pink-400" size={36} /> Coleções
        </h1>
        <p className="text-neutral-400 text-lg">Complete sets de itens para ganhar bônus exclusivos.</p>
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center">
             <div className="w-32 h-32 bg-neutral-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Star className="text-neutral-600 w-12 h-12" />
             </div>
             <div className="flex-1">
               <h3 className="text-2xl font-bold mb-2">Coleção Estelar #{i}</h3>
               <p className="text-neutral-400 mb-4">Complete esta coleção para ganhar um multiplicador de 1.5x permanente de XP e uma insígnia exclusiva de explorador estelar.</p>
               
               <div className="w-full bg-neutral-800 rounded-full h-4 mb-2 overflow-hidden">
                 <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full" style={{ width: `${i * 20}%` }}></div>
               </div>
               <p className="text-xs text-neutral-500 text-right font-bold">{i}/5 Itens</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
