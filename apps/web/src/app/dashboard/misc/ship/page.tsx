"use client";

import { Heart, HeartHandshake } from "lucide-react";

export default function ShipPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-center">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 text-sm font-bold mb-6 border border-red-500/20">
          <Heart size={16} /> Casamento Cósmico
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Encontre sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">Alma Gêmea</span></h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Case com outros usuários usando o comando de ship. Usuários casados ganham uma insígnia exclusiva e dividem o bônus de XP!
        </p>
      </div>

      <div className="bg-neutral-900/50 border border-white/5 rounded-[3rem] p-12 max-w-2xl mx-auto relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 blur-[100px] rounded-full pointer-events-none"></div>
         
         <div className="flex justify-center items-center gap-8 relative z-10">
            <div className="w-24 h-24 bg-neutral-800 rounded-full border-4 border-neutral-900 shadow-xl flex items-center justify-center">
              Você
            </div>
            <HeartHandshake className="text-red-500 w-12 h-12 animate-pulse" />
            <div className="w-24 h-24 bg-neutral-800 rounded-full border-4 border-neutral-900 shadow-xl flex items-center justify-center border-dashed text-neutral-500 text-xs">
              Esperando...
            </div>
         </div>
         
         <div className="mt-12 relative z-10">
           <p className="text-neutral-400 mb-6">Você ainda não está casado com ninguém.</p>
           <div className="bg-black/50 p-4 rounded-xl border border-white/5 inline-block text-sm">
             Use <code className="text-red-400 font-bold">/marry @usuario</code> no Discord
           </div>
         </div>
      </div>
    </div>
  );
}
