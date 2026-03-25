import { useI18nContext } from "./context";

/**
 * Returns t(key) for the current locale.
 * Key can be "common.cancel" or with namespace: "account.title".
 * If namespace is passed, t("title") resolves to "account.title".
 */
export function useTranslation(namespace?: string) {
  const { locale, setLocale, translations } = useI18nContext();
  const map = translations[locale];

  const t = (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return map[fullKey] ?? fullKey;
  };

  return { t, locale, setLocale };
}
