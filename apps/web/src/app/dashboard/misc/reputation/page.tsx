"use client";

import { ThumbsUp, Medal } from "lucide-react";

export default function ReputationPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-2 flex justify-center items-center gap-3">
          <Medal className="text-green-400" size={36} /> Reputação Galáctica
        </h1>
        <p className="text-neutral-400 text-lg">Veja sua influência na comunidade através dos pontos de reputação (+rep).</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
         <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px]"></div>
            <p className="text-neutral-400 mb-2 uppercase tracking-widest text-xs font-bold">Reputação Recebida</p>
            <div className="text-6xl font-black text-white flex items-center gap-4">
              142 <ThumbsUp className="text-green-400 w-12 h-12" />
            </div>
         </div>
         <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <p className="text-neutral-400 mb-2 uppercase tracking-widest text-xs font-bold">Reputação Enviada</p>
            <div className="text-4xl font-black text-neutral-500 flex items-center gap-4">
              56 <ThumbsUp className="text-neutral-600 w-8 h-8" />
            </div>
         </div>
      </div>
      
      <div className="bg-black/50 p-6 rounded-2xl border border-white/5 text-center text-sm text-neutral-400">
        Para dar +rep a outro usuário, use o comando <code className="text-green-400 font-bold px-2 py-1 bg-green-500/10 rounded">/rep @usuario</code> no servidor do Discord.
      </div>
    </div>
  );
}
