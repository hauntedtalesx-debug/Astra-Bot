"use client";

import { useTranslation } from "@/i18n";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
      >
        <Globe size={18} />
        {locale === "pt-BR" ? "PT-BR" : "EN-US"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-neutral-900 border border-white/10 shadow-lg shadow-black/50 overflow-hidden z-50">
          <button
            onClick={() => {
              setLocale("pt-BR");
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
              locale === "pt-BR" ? "text-purple-400 font-bold" : "text-neutral-300"
            }`}
          >
            🇧🇷 Português
          </button>
          <button
            onClick={() => {
              setLocale("en-US");
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
              locale === "en-US" ? "text-purple-400 font-bold" : "text-neutral-300"
            }`}
          >
            🇺🇸 English
          </button>
        </div>
      )}
    </div>
  );
}
