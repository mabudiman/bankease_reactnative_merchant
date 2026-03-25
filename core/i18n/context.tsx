"use client";

import React, { createContext, useState, useMemo } from "react";
import type { Locale, TranslationsByLocale } from "./types";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: TranslationsByLocale;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  translations,
  defaultLocale = "en",
}: {
  children: React.ReactNode;
  translations: TranslationsByLocale;
  defaultLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const value = useMemo(
    () => ({ locale, setLocale, translations }),
    [locale, translations],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18nContext must be used within I18nProvider");
  return ctx;
}
