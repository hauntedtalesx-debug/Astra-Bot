"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface UserSettings {
  notifyDaily: boolean;
  notifyMarriageExpire: boolean;
  notifyMarriageEnded: boolean;
  notifyMarriageRenew: boolean;
  notifyLoveLetter: boolean;
  notifyLevelUp: boolean;
  notifyGiveawayEnd: boolean;
}

const NotificationItem = ({ 
  id, 
  title, 
  description,
  settings,
  handleToggle,
  saving
}: { 
  id: keyof UserSettings; 
  title: string; 
  description: string; 
  settings: UserSettings | null;
  handleToggle: (key: keyof UserSettings) => void;
  saving: boolean;
}) => (
  <div className="flex items-start justify-between py-5 border-b border-white/5 last:border-0">
    <div className="pr-8">
      <h4 className="text-white font-bold mb-1">{title}</h4>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
    <button 
      onClick={() => handleToggle(id)}
      disabled={saving}
      className={`shrink-0 w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none ${
        settings?.[id] ? "bg-cyan-500" : "bg-neutral-700"
      } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span 
        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
          settings?.[id] ? "translate-x-6" : "translate-x-0"
        }`} 
      />
    </button>
  </div>
);

export default function NotificationsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/user/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load settings", err);
        setLoading(false);
      });
  }, []);

  const handleToggle = async (key: keyof UserSettings) => {
    if (!settings) return;

    const newValue = !settings[key];
    setSettings((prev) => prev ? { ...prev, [key]: newValue } : null);
    setSaving(true);

    try {
      await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: newValue }),
      });
    } catch (error) {
      console.error("Failed to update setting", error);
      // Revert in case of error
      setSettings((prev) => prev ? { ...prev, [key]: !newValue } : null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-extrabold text-cyan-400 mb-4">Alertas Cósmicos</h2>
      
      <div className="text-neutral-300 mb-8 space-y-4">
        <p>
          Escolha quais alertas passivos você deseja receber no seu privado! Alertas passivos são notificações que você recebe sem ter uma interação direta com a Astra naquele momento.
        </p>
        <p className="text-sm text-neutral-500">
          Você também pode configurar as notificações passivas pelo comando <span className="text-cyan-400">/alertas configurar</span>.
        </p>
      </div>

      <div className="bg-[#101524] rounded-2xl border border-white/5 p-6 mb-8 shadow-lg">
        <NotificationItem 
          id="notifyDaily"
          title="Lembrete do Resgate Diário"
          description="Notificações que a Astra envia falando que você já pode pegar sua recompensa diária novamente."
          settings={settings}
          saving={saving}
          handleToggle={handleToggle}
        />
        <NotificationItem 
          id="notifyMarriageExpire"
          title="Notificação de Expiração do Casamento Cósmico"
          description="Notificações que a Astra envia falando que o seu casamento irá expirar em breve por falta de interação."
          settings={settings}
          saving={saving}
          handleToggle={handleToggle}
        />
        <NotificationItem 
          id="notifyMarriageEnded"
          title="Notificação que o Casamento Acabou"
          description="Notificações sobre o seu casamento que acabou por falta de interação."
          settings={settings}
          saving={saving}
          handleToggle={handleToggle}
        />
        <NotificationItem 
          id="notifyMarriageRenew"
          title="Notificação que o Casamento Foi Renovado"
          description="Notificações sobre o seu casamento que foi renovado automaticamente ao ter ficado interagindo."
          settings={settings}
          saving={saving}
          handleToggle={handleToggle}
        />
        <NotificationItem 
          id="notifyLoveLetter"
          title="Notificação de Cartinha Estelar"
          description="Notificações sobre as cartinhas enviadas pelo seu parceiro(a)."
          settings={settings}
          saving={saving}
          handleToggle={handleToggle}
        />
        <NotificationItem 
          id="notifyLevelUp"
          title="Notificação ao Subir de Nível"
          description="Notificações ao subir de nível globalmente. Esta configuração apenas afeta as mensagens enviadas no privado, caso o servidor não permita envio no chat."
          settings={settings}
          saving={saving}
          handleToggle={handleToggle}
        />
        <NotificationItem 
          id="notifyGiveawayEnd"
          title="Notificação ao Encerrar um Sorteio"
          description="Notificações quando um sorteio que você está gerenciando é encerrado."
          settings={settings}
          saving={saving}
          handleToggle={handleToggle}
        />
      </div>
    </div>
  );
}
