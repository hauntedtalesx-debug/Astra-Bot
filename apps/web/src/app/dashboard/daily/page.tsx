"use client";

import { useState } from "react";
import { Gift, Clock, Star, Diamond, Sparkles } from "lucide-react";

export default function DailyPage() {
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState<number | null>(null);

  const handleClaim = () => {
    // Simulando resgate
    const amount = Math.floor(Math.random() * 500) + 100;
    setReward(amount);
    setClaimed(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 font-bold mb-6 border border-yellow-500/20">
        <Star size={16} /> Recompensa Diária
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Resgate seu Bônus</h1>
      <p className="text-lg text-neutral-400 mb-12 max-w-2xl mx-auto">
        Volte todos os dias para resgatar AstraCoins grátis! Quanto mais dias seguidos você voltar, maior será o multiplicador do seu prêmio.
      </p>

      <div className="bg-[#0B0F19] border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden max-w-2xl mx-auto shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        {/* Streak Indicator */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
             🔥 Sequência: <span className="text-orange-400">3 Dias</span>
           </div>
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
             Próximo multiplicador: <span className="text-green-400">1.5x</span>
           </div>
        </div>

        <div className="relative z-10 flex flex-col items-center mt-12">
          {!claimed ? (
            <>
              <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(234,179,8,0.4)] animate-pulse">
                <Gift size={80} className="text-white drop-shadow-md" />
              </div>
              <button 
                onClick={handleClaim}
                className="bg-white text-black font-extrabold text-xl px-12 py-5 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                Resgatar Agora
              </button>
            </>
          ) : (
            <div className="animate-in zoom-in duration-500 flex flex-col items-center">
              <div className="w-48 h-48 relative flex items-center justify-center mb-8">
                <Sparkles size={100} className="text-yellow-400 absolute animate-spin-slow" />
                <Diamond size={60} className="text-purple-400 relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Parabéns!</h2>
              <p className="text-neutral-400 text-lg mb-6">Você recebeu <span className="text-yellow-400 font-bold">+{reward} AstraCoins</span>!</p>
              
              <div className="flex items-center gap-2 text-neutral-500 bg-black/50 px-6 py-3 rounded-xl border border-white/5">
                <Clock size={18} /> Volte em 23h 59m para resgatar novamente
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
