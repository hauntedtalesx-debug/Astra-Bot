"use client";

import { Layout, CheckCircle2, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { getProfileSettings, updateLayout } from "@/actions/profile";

const LAYOUTS = [
  { id: "default", name: "Padrão", isPremium: false, image: "https://placehold.co/400x200/0f172a/ffffff?text=Padrão" },
  { id: "compact", name: "Compacto", isPremium: false, image: "https://placehold.co/400x200/0f172a/ffffff?text=Compacto" },
  { id: "anime", name: "Anime Style", isPremium: true, image: "https://placehold.co/400x200/ec4899/ffffff?text=Anime+Style" },
  { id: "cyberpunk", name: "Cyberpunk", isPremium: true, image: "https://placehold.co/400x200/a855f7/ffffff?text=Cyberpunk" }
];

export default function LayoutPage() {
  const [selected, setSelected] = useState("default");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{message: string, isError: boolean} | null>(null);

  useEffect(() => {
    getProfileSettings().then(data => {
      if (data && data.layoutId) {
        setSelected(data.layoutId);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateLayout(selected);
    
    if (result.success) {
      setNotification({ message: "Layout atualizado com sucesso!", isError: false });
    } else {
      setNotification({ message: result.error || "Erro ao salvar", isError: true });
    }
    setSaving(false);
    
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-cyan-400" size={48} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-2xl animate-in slide-in-from-top-4 ${notification.isError ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
          {!notification.isError && <Check size={20} />}
          {notification.message}
        </div>
      )}

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
          <Layout className="text-cyan-400" size={36} /> Layout do Perfil
        </h1>
        <p className="text-neutral-400 text-lg">Escolha como as informações do seu perfil (/perfil) serão exibidas no Discord.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {LAYOUTS.map((layout) => (
          <div 
            key={layout.id} 
            onClick={() => setSelected(layout.id)}
            className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all border-4 ${selected === layout.id ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-transparent hover:border-white/10 bg-neutral-900/50'}`}
          >
            <img src={layout.image} alt={layout.name} className="w-full h-48 object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                   {layout.name}
                   {layout.isPremium && <span className="bg-purple-500 text-white text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Premium</span>}
                 </h3>
                 {selected === layout.id && <CheckCircle2 className="text-cyan-400" size={24} />}
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-cyan-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-cyan-400 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}
