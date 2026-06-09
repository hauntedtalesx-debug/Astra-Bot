import { Smartphone, Download, QrCode } from "lucide-react";

export default function MobilePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold mb-6 border border-cyan-500/20">
            <Smartphone size={16} /> Astra Mobile
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Leve a Astra no <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">seu bolso</span>
          </h1>
          <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
            Controle os módulos do seu servidor, receba notificações de moderação, envie alertas de live pelo celular e resgate suas recompensas diárias onde quer que você esteja.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-neutral-200 transition-colors">
              <Download size={20} />
              Baixar para iOS
            </button>
            <button className="flex items-center justify-center gap-3 bg-[#0B0F19] border border-white/10 font-bold px-8 py-4 rounded-xl hover:bg-white/5 transition-colors">
              <Download size={20} />
              Baixar para Android
            </button>
          </div>
          
          <p className="text-xs text-neutral-500 mt-6 flex items-center gap-2">
            * O aplicativo está atualmente em fase Beta Fechado.
          </p>
        </div>

        <div className="flex-1 flex justify-center relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full z-0"></div>
          <div className="relative z-10 w-64 h-[500px] bg-neutral-900 border-8 border-neutral-800 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-6 overflow-hidden">
             <div className="absolute top-0 w-32 h-6 bg-neutral-800 rounded-b-3xl"></div>
             
             <div className="text-center mb-8 mt-12">
               <h3 className="text-2xl font-bold mb-2">Beta Preview</h3>
               <p className="text-xs text-neutral-400">Escaneie para entrar na lista de espera</p>
             </div>
             
             <div className="bg-white p-4 rounded-2xl">
               <QrCode className="w-40 h-40 text-black" />
             </div>
             
             <div className="mt-auto pt-8 flex gap-4 text-cyan-400">
               <div className="w-12 h-2 bg-cyan-500/50 rounded-full"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
