"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ptBR from "./locales/pt-BR.json";
import enUS from "./locales/en-US.json";

export type Locale = "pt-BR" | "en-US";
export type Translations = typeof ptBR;

const translations: Record<Locale, Translations> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

interface I18nContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("astra-locale") as Locale;
      if (savedLocale && (savedLocale === "pt-BR" || savedLocale === "en-US")) {
        return savedLocale;
      }
      const browserLang = navigator.language;
      if (browserLang.startsWith("en")) {
        return "en-US";
      }
    }
    return "pt-BR";
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("astra-locale", newLocale);
  };

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
