"use client";

import { Ghost, Star } from "lucide-react";

export default function PetsPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
          <Ghost className="text-purple-400" size={36} /> Companheiros Cósmicos
        </h1>
        <p className="text-neutral-400 text-lg">Adote pets virtuais que concedem bônus passivos no servidor.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 text-center hover:bg-neutral-800 transition-colors relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] group-hover:bg-purple-500/20 transition-all"></div>
             
             <div className="w-24 h-24 mx-auto bg-neutral-800 rounded-full flex items-center justify-center mb-6 relative z-10 border-4 border-neutral-900 shadow-xl">
                <Ghost className="text-purple-400 w-10 h-10" />
             </div>
             <h3 className="font-bold text-xl mb-1 relative z-10">Pet {i}</h3>
             <div className="flex justify-center items-center gap-1 text-yellow-400 mb-4 relative z-10">
               <Star size={14} fill="currentColor" />
               <Star size={14} fill="currentColor" />
               <Star size={14} fill="currentColor" />
             </div>
             <p className="text-neutral-400 text-sm mb-6 relative z-10">Concede +5% de XP em todas as mensagens enviadas.</p>
             <button className="w-full bg-neutral-800 hover:bg-purple-500 hover:text-white font-bold py-3 rounded-xl transition-colors relative z-10">
               Adotar por 5,000 AstraCoins
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
