"use client";

import { ShoppingCart, Box, Zap, Sparkles, Diamond, Crown, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserBalance, purchaseItem } from "@/actions/store";

const STORE_ITEMS = [
  { id: 1, name: "VIP Cósmico (30 dias)", price: 5000, icon: <Crown size={32} className="text-yellow-400" />, desc: "Destaque no ranking e acesso a comandos exclusivos.", category: "Vantagens" },
  { id: 2, name: "Multiplicador XP (x2)", price: 1500, icon: <Zap size={32} className="text-cyan-400" />, desc: "Ganha o dobro de XP por 24 horas no servidor.", category: "Boosters" },
  { id: 3, name: "Fundo de Perfil: Galáxia", price: 300, icon: <Sparkles size={32} className="text-purple-400" />, desc: "Um fundo animado de galáxia para o seu cartão de perfil.", category: "Cosméticos" },
  { id: 4, name: "Caixa Misteriosa", price: 100, icon: <Box size={32} className="text-pink-400" />, desc: "Pode conter AstraCoins, XP ou itens super raros!", category: "Lootboxes" }
];

export default function StorePage() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");
  
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [notification, setNotification] = useState<{message: string, isError: boolean} | null>(null);

  useEffect(() => {
    // Busca o saldo real do banco de dados ao abrir a página
    getUserBalance().then(realBalance => {
      setBalance(realBalance);
      setLoading(false);
    });
  }, []);

  const handlePurchase = async (itemId: number, price: number, name: string) => {
    setPurchasing(itemId);
    setNotification(null);
    
    const result = await purchaseItem(itemId, price, name);
    
    if (result.success) {
      setBalance(result.newBalance!);
      setNotification({ message: result.message!, isError: false });
    } else {
      setNotification({ message: result.error!, isError: true });
    }
    
    setPurchasing(null);
    
    // Some com a notificação depois de 3 segundos
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-cyan-400" size={48} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      
      {/* Toast de Notificação flutuante */}
      {notification && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-2xl animate-in slide-in-from-top-4 ${notification.isError ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
          {!notification.isError && <Check size={20} />}
          {notification.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
            <ShoppingCart className="text-cyan-400" size={36} /> Mercado Cósmico
          </h1>
          <p className="text-neutral-400 text-lg">Troque suas AstraCoins por vantagens, multiplicadores e itens exclusivos.</p>
        </div>
        
        <div className="bg-neutral-900/80 border border-purple-500/30 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Diamond className="text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1">Seu Saldo</p>
            <p className="text-2xl font-bold text-white flex items-center gap-2">
              {balance.toLocaleString()} <span className="text-purple-400 text-sm">AstraCoins</span>
            </p>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
        {["Todos", "Vantagens", "Boosters", "Cosméticos", "Lootboxes"].map((cat) => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-colors ${category === cat ? "bg-cyan-500 text-black" : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STORE_ITEMS.filter(i => category === "Todos" || i.category === category).map((item) => (
          <div key={item.id} className="bg-neutral-900/50 border border-white/5 hover:border-cyan-500/50 transition-all rounded-2xl p-6 flex flex-col group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] group-hover:bg-cyan-500/20 transition-all"></div>
             
             <div className="w-16 h-16 bg-[#0B0F19] rounded-2xl flex items-center justify-center mb-6 border border-white/5 relative z-10">
               {item.icon}
             </div>
             
             <h3 className="font-bold text-lg mb-2 relative z-10">{item.name}</h3>
             <p className="text-sm text-neutral-400 mb-6 flex-1 relative z-10">{item.desc}</p>
             
             <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 relative z-10">
               <span className="font-bold text-purple-400 flex items-center gap-1.5">
                 <Diamond size={14} /> {item.price}
               </span>
               <button 
                 className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center min-w-[80px] ${balance >= item.price ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
                 disabled={balance < item.price || purchasing !== null}
                 onClick={() => handlePurchase(item.id, item.price, item.name)}
               >
                 {purchasing === item.id ? <Loader2 size={16} className="animate-spin" /> : "Comprar"}
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
