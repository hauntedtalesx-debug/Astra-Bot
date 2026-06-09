"use client";

import { Image as ImageIcon, Upload } from "lucide-react";
import { useState } from "react";

export default function BackgroundPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="aspect-video bg-neutral-800 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer border-2 border-transparent hover:border-cyan-500">
            <img src={`https://via.placeholder.com/300x150/101524/ffffff?text=Banner+${i}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
