"use client";

import { ShoppingBag, Sparkles } from "lucide-react";

export default function CosmeticsShopPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
          <ShoppingBag className="text-pink-400" size={36} /> Loja de Cosméticos
        </h1>
        <p className="text-neutral-400 text-lg">Compre bordas, ícones e efeitos para destacar seu perfil.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 text-center hover:bg-neutral-800 transition-colors">
             <div className="w-16 h-16 mx-auto bg-neutral-800 rounded-full flex items-center justify-center mb-4 relative">
                <Sparkles className="text-pink-400 w-8 h-8" />
                <div className="absolute inset-0 rounded-full border-2 border-pink-400/50 animate-ping"></div>
             </div>
             <h3 className="font-bold mb-1">Borda Neon {i}</h3>
             <p className="text-pink-400 font-bold text-sm mb-4">1,000 AstraCoins</p>
             <button className="w-full bg-neutral-800 hover:bg-pink-500 hover:text-white font-bold py-2 rounded-lg transition-colors text-sm">
               Comprar
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
