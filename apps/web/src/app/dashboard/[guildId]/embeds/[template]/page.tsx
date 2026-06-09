"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getEmbedTemplate, saveEmbedTemplate, resetEmbedTemplate } from "@/actions/embeds";
import { DiscordPreview } from "@/components/DiscordPreview";
import { ArrowLeft, Save, RefreshCcw, Send, Loader2, Check } from "lucide-react";
import Link from "next/link";

const DEFAULT_TEMPLATES: Record<string, any> = {
  WELCOME: { title: 'Bem-vindo(a) à comunidade!', description: 'Olá {user}, seja muito bem-vindo(a) ao **{server}**! Sinta-se em casa.', color: '#8b5cf6' },
  LIVE_ONLINE: { title: '🔴 A live começou!', description: 'O(a) {creator} acabou de ficar online! Vem colar com a gente:\n\n{liveUrl}', color: '#e74c3c' },
  YOUTUBE_NEW: { title: '📺 Vídeo Novo no Ar!', description: 'Temos um novo vídeo: **{youtubeTitle}**\n\nAssista agora: {youtubeUrl}', color: '#e74c3c' },
  RANKING_WEEKLY: { title: '🏆 Ranking da Semana', description: 'Parabéns ao nosso membro mais ativo da semana: {rankingTop1}!', color: '#f1c40f' },
  LEVEL_UP: { title: '🌟 Subiu de Nível!', description: 'Parabéns {user}, você acaba de alcançar o Nível {level}!', color: '#10b981' },
  DAILY_REWARD: { title: '🎁 Recompensa Diária', description: '{user} resgatou sua recompensa de {coins} Stardust!', color: '#3498db' },
  GIVEAWAY: { title: '🎉 Sorteio Iniciado', description: 'Clique no botão abaixo para participar!', color: '#9b59b6' },
  MISSION: { title: '📜 Nova Missão', description: 'Cumpra a missão e ganhe XP e Moedas!', color: '#e67e22' },
};

export default function MessageEditorPage({ params }: { params: { guildId: string, template: string } }) {
  const router = useRouter();
  const templateKey = params.template.toUpperCase();
  const defaultTpl = DEFAULT_TEMPLATES[templateKey] || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{msg: string, err: boolean} | null>(null);

  // Form State
  const [title, setTitle] = useState(defaultTpl.title || "");
  const [description, setDescription] = useState(defaultTpl.description || "");
  const [color, setColor] = useState(defaultTpl.color || "#8b5cf6");
  const [imageUrl, setImageUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorIconUrl, setAuthorIconUrl] = useState("");
  const [footerText, setFooterText] = useState("");
  const [footerIconUrl, setFooterIconUrl] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  useEffect(() => {
    getEmbedTemplate(params.guildId, templateKey).then(data => {
      if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setColor(data.color || "#8b5cf6");
        setImageUrl(data.imageUrl || "");
        setThumbnailUrl(data.thumbnailUrl || "");
        setAuthorName(data.authorName || "");
        setAuthorIconUrl(data.authorIconUrl || "");
        setFooterText(data.footerText || "");
        setFooterIconUrl(data.footerIconUrl || "");
        setButtonLabel(data.buttonLabel || "");
        setButtonUrl(data.buttonUrl || "");
      }
      setLoading(false);
    });
  }, [params.guildId, templateKey]);

  const handleSave = async () => {
    setSaving(true);
    const result = await saveEmbedTemplate(params.guildId, templateKey, {
      title, description, color, imageUrl, thumbnailUrl, authorName, authorIconUrl, footerText, footerIconUrl, buttonLabel, buttonUrl
    });
    setSaving(false);
    if (result.success) {
      setNotification({ msg: "Template salvo com sucesso!", err: false });
    } else {
      setNotification({ msg: result.error || "Erro ao salvar", err: true });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReset = async () => {
    if (!confirm("Tem certeza que deseja resetar para o padrão de fábrica? Todas as edições serão perdidas.")) return;
    setSaving(true);
    await resetEmbedTemplate(params.guildId, templateKey);
    // Reload state
    setTitle(defaultTpl.title || "");
    setDescription(defaultTpl.description || "");
    setColor(defaultTpl.color || "#8b5cf6");
    setImageUrl(""); setThumbnailUrl(""); setAuthorName(""); setAuthorIconUrl(""); setFooterText(""); setFooterIconUrl(""); setButtonLabel(""); setButtonUrl("");
    setSaving(false);
    setNotification({ msg: "Template resetado!", err: false });
    setTimeout(() => setNotification(null), 3000);
  };

  const parseDummy = (text: string) => {
    return text
      .replace(/{user}/g, "@Vitor")
      .replace(/{username}/g, "Vitor")
      .replace(/{server}/g, "Comunidade Estelar")
      .replace(/{creator}/g, "Felipe")
      .replace(/{liveUrl}/g, "https://twitch.tv/hauntedtalesx")
      .replace(/{youtubeTitle}/g, "React ao Novo Trailer")
      .replace(/{youtubeUrl}/g, "https://youtube.com/watch?v=123")
      .replace(/{rankingTop1}/g, "@MembroAtivo")
      .replace(/{level}/g, "15")
      .replace(/{coins}/g, "500");
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-purple-500" size={48} /></div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col h-full">
      {notification && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-2xl animate-in slide-in-from-top-4 ${notification.err ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
          {!notification.err && <Check size={20} />} {notification.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/${params.guildId}/embeds`} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold">Editor: {templateKey}</h1>
            <p className="text-neutral-400 text-sm">Configure o visual da mensagem automática.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-bold transition-colors">
            <RefreshCcw size={18} /> Resetar Padrão
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Salvar
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Editor Form */}
        <div className="lg:w-1/2 space-y-6 overflow-y-auto pr-2 pb-10">
          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 text-purple-400 border-b border-white/5 pb-2">Corpo da Mensagem</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-neutral-300">Título (max 256)</label>
                <input maxLength={256} value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Ex: Bem-vindo!" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1 text-neutral-300">Descrição (max 4096)</label>
                <textarea maxLength={4096} rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Conteúdo principal..." />
                <p className="text-xs text-neutral-500 mt-1">Variáveis disponíveis: {`{user}, {username}, {server}, {coins}`}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-neutral-300">Cor do Embed (HEX)</label>
                <div className="flex gap-2">
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0 p-0 bg-transparent" />
                  <input value={color} onChange={e => setColor(e.target.value)} className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors uppercase" placeholder="#8B5CF6" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 text-purple-400 border-b border-white/5 pb-2">Mídias (Opcional)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-neutral-300">URL da Imagem Maior</label>
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-neutral-300">URL da Thumbnail (Miniatura)</label>
                <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 text-purple-400 border-b border-white/5 pb-2">Rodapé e Autor</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                 <label className="block text-sm font-semibold mb-1 text-neutral-300">Nome do Autor</label>
                 <input value={authorName} onChange={e => setAuthorName(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" />
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-1 text-neutral-300">Ícone do Autor (URL)</label>
                 <input value={authorIconUrl} onChange={e => setAuthorIconUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-semibold mb-1 text-neutral-300">Texto do Rodapé</label>
                 <input value={footerText} onChange={e => setFooterText(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" />
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-1 text-neutral-300">Ícone do Rodapé (URL)</label>
                 <input value={footerIconUrl} onChange={e => setFooterIconUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" />
               </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
             <h3 className="font-bold text-lg mb-4 text-purple-400 border-b border-white/5 pb-2">Botão de Link (Opcional)</h3>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-semibold mb-1 text-neutral-300">Texto do Botão</label>
                 <input value={buttonLabel} onChange={e => setButtonLabel(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Clique Aqui" />
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-1 text-neutral-300">URL do Botão</label>
                 <input value={buttonUrl} onChange={e => setButtonUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="https://..." />
               </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:w-1/2 sticky top-8 self-start">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-xl font-bold text-neutral-300 flex items-center gap-2">Live Preview</h3>
             <div className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded">Modo Escuro</div>
          </div>
          
          <DiscordPreview 
            title={parseDummy(title)}
            description={parseDummy(description)}
            color={color}
            image={parseDummy(imageUrl)}
            thumbnail={parseDummy(thumbnailUrl)}
            authorName={parseDummy(authorName)}
            authorIcon={parseDummy(authorIconUrl)}
            footerText={parseDummy(footerText)}
            footerIcon={parseDummy(footerIconUrl)}
            buttonLabel={parseDummy(buttonLabel)}
          />

          <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">Disparar Teste Real</h4>
              <p className="text-neutral-500 text-xs">Envia exatamente essa mensagem no canal selecionado via bot.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold transition-colors text-sm border border-neutral-700">
              <Send size={14} /> Enviar no Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
