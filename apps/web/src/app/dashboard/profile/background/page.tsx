"use client";

import { Image as ImageIcon, Upload, CheckCircle2, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { getProfileSettings, updateBackground } from "@/actions/profile";

const BACKGROUNDS = [
  { id: "https://via.placeholder.com/600x200/101524/ffffff?text=Banner+Nebulosa", name: "Nebulosa" },
  { id: "https://via.placeholder.com/600x200/101524/ffffff?text=Banner+Supernova", name: "Supernova" },
  { id: "https://via.placeholder.com/600x200/101524/ffffff?text=Banner+Galaxia", name: "Galáxia" },
  { id: "https://via.placeholder.com/600x200/101524/ffffff?text=Banner+Estelar", name: "Pó Estelar" }
];

export default function BackgroundPage() {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{message: string, isError: boolean} | null>(null);

  useEffect(() => {
    getProfileSettings().then(data => {
      if (data && data.backgroundUrl) {
        setSelected(data.backgroundUrl);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (bgUrl: string) => {
    setSelected(bgUrl);
    setSaving(true);
    const result = await updateBackground(bgUrl);
    
    if (result.success) {
      setNotification({ message: "Fundo atualizado com sucesso!", isError: false });
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
          <ImageIcon className="text-cyan-400" size={36} /> Fundo do Perfil
        </h1>
        <p className="text-neutral-400 text-lg">Personalize o banner de fundo do seu cartão de perfil do Discord.</p>
      </div>

      <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-8 mb-12 text-center border-dashed border-2 hover:border-cyan-500/50 transition-colors cursor-pointer group">
        <Upload className="w-16 h-16 mx-auto text-neutral-500 group-hover:text-cyan-400 mb-4 transition-colors" />
        <h3 className="text-xl font-bold mb-2">Upload Personalizado</h3>
        <p className="text-neutral-400 text-sm">Faça upload da sua própria imagem ou GIF (Requer Astra Premium)</p>
      </div>

      <h3 className="text-2xl font-bold mb-6">Galeria Gratuita</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BACKGROUNDS.map((bg) => (
          <div 
            key={bg.id} 
            onClick={() => handleSave(bg.id)}
            className={`relative aspect-[3/1] bg-neutral-800 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all cursor-pointer border-4 ${selected === bg.id ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-transparent hover:border-white/10'}`}
          >
            <img src={bg.id} alt={bg.name} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold">{bg.name}</h3>
                 {selected === bg.id && <CheckCircle2 className="text-cyan-400" size={24} />}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
