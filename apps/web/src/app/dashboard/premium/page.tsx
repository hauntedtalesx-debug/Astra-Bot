"use client";

import { useState } from "react";
import { Check, X, CreditCard, Banknote, QrCode, Ticket } from "lucide-react";

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      
      {/* Payment Methods */}
      <div className="mb-16 text-center">
        <h3 className="text-cyan-400 font-bold mb-6">Nós Aceitamos</h3>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <QrCode size={32} className="text-cyan-400" />
            <span className="text-sm font-medium">Pix</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <CreditCard size={32} className="text-orange-400" />
            <span className="text-sm font-medium">Cartão de Crédito</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <Banknote size={32} className="text-red-400" />
            <span className="text-sm font-medium">Cartão de Débito</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <Ticket size={32} className="text-purple-400" />
            <span className="text-sm font-medium">Boleto</span>
          </div>
        </div>
      </div>

      {/* Header & Toggle */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-cyan-400 mb-6">Astra Premium Pessoal</h2>
        
        <div className="inline-flex bg-neutral-900 rounded-full p-1 border border-white/10">
          <button 
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-cyan-500 text-white shadow-lg" : "text-neutral-400 hover:text-white"}`}
          >
            Mensal
          </button>
          <button 
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === "yearly" ? "bg-cyan-500 text-white shadow-lg" : "text-neutral-400 hover:text-white"}`}
          >
            Anual <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">-20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
        
        {/* Pro Card */}
        <div className="bg-[#101524] rounded-2xl border border-white/5 p-8 flex flex-col hover:border-cyan-500/50 transition-colors">
          <h3 className="text-cyan-400 font-bold mb-4">Supernova (Pro)</h3>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-white">
              {billingCycle === "monthly" ? "R$ 15,00" : "R$ 144,00"}
            </span>
            <span className="text-neutral-500 text-sm">/{billingCycle === "monthly" ? "mensal" : "anual"}</span>
          </div>
          <button className="mt-auto w-full py-3 rounded-lg bg-[#1A2235] hover:bg-[#252F48] text-white font-bold transition-colors border border-white/5">
            Comprar ({billingCycle === "monthly" ? "R$ 15,00" : "R$ 144,00"})
          </button>
        </div>

        {/* Creator Card */}
        <div className="bg-[#101524] rounded-2xl border border-orange-500/50 p-8 flex flex-col relative shadow-[0_0_30px_rgba(249,115,22,0.1)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Recomendado
          </div>
          <h3 className="text-cyan-400 font-bold mb-4">Galáxia (Creator)</h3>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-white">
              {billingCycle === "monthly" ? "R$ 35,00" : "R$ 336,00"}
            </span>
            <span className="text-neutral-500 text-sm">/{billingCycle === "monthly" ? "mensal" : "anual"}</span>
          </div>
          <button className="mt-auto w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold transition-colors shadow-lg shadow-green-600/20">
            Comprar ({billingCycle === "monthly" ? "R$ 35,00" : "R$ 336,00"})
          </button>
        </div>

      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="py-4 font-bold text-cyan-400 w-1/2">Recurso</th>
              <th className="py-4 font-bold text-center text-cyan-400">Grátis</th>
              <th className="py-4 font-bold text-center text-cyan-400">Supernova</th>
              <th className="py-4 font-bold text-center text-white bg-cyan-500 rounded-t-lg px-2">Galáxia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-4 text-neutral-300">Sem anúncios no painel da Astra</td>
              <td className="py-4 text-center"><X size={18} className="mx-auto text-neutral-600" /></td>
              <td className="py-4 text-center"><Check size={18} className="mx-auto text-white" /></td>
              <td className="py-4 text-center bg-cyan-500/10"><Check size={18} className="mx-auto text-white" /></td>
            </tr>
            <tr>
              <td className="py-4 text-neutral-300">Backgrounds customizados no perfil</td>
              <td className="py-4 text-center"><X size={18} className="mx-auto text-neutral-600" /></td>
              <td className="py-4 text-center"><X size={18} className="mx-auto text-neutral-600" /></td>
              <td className="py-4 text-center bg-cyan-500/10"><Check size={18} className="mx-auto text-white" /></td>
            </tr>
            <tr>
              <td className="py-4 text-neutral-300">Alertas Cósmicos passivos no PV</td>
              <td className="py-4 text-center"><X size={18} className="mx-auto text-neutral-600" /></td>
              <td className="py-4 text-center"><Check size={18} className="mx-auto text-white" /></td>
              <td className="py-4 text-center bg-cyan-500/10"><Check size={18} className="mx-auto text-white" /></td>
            </tr>
            <tr>
              <td className="py-4 text-neutral-300">Limite de Sonhos acumuláveis diários</td>
              <td className="py-4 text-center text-neutral-400">10.000</td>
              <td className="py-4 text-center text-white font-medium">25.000</td>
              <td className="py-4 text-center bg-cyan-500/10 text-white font-medium">50.000</td>
            </tr>
            <tr>
              <td className="py-4 text-neutral-300">Bônus de reputação ao avaliar</td>
              <td className="py-4 text-center text-neutral-400">0%</td>
              <td className="py-4 text-center text-white font-medium">+10%</td>
              <td className="py-4 text-center bg-cyan-500/10 text-white font-medium">+25%</td>
            </tr>
            <tr>
              <td className="py-4 text-neutral-300">Taxa do Mercado Cósmico</td>
              <td className="py-4 text-center text-neutral-400">10%</td>
              <td className="py-4 text-center text-white font-medium">5%</td>
              <td className="py-4 text-center bg-cyan-500/10 text-cyan-400 font-bold">Sem taxas</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
