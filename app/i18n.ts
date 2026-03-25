import type { TranslationsByLocale, TranslationMap } from "@/core/i18n";
import commonEn from "@/core/i18n/locales/en.json";
import commonId from "@/core/i18n/locales/id.json";
import accountEn from "@/features/account/locales/en.json";
import accountId from "@/features/account/locales/id.json";

function flattenWithPrefix(
  obj: Record<string, string>,
  prefix: string,
): TranslationMap {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [`${prefix}.${k}`, v]),
  );
}

function merge(...maps: TranslationMap[]): TranslationMap {
  return Object.assign({}, ...maps);
}

export const translations: TranslationsByLocale = {
  en: merge(
    flattenWithPrefix(commonEn as Record<string, string>, "common"),
    flattenWithPrefix(accountEn as Record<string, string>, "account"),
  ),
  id: merge(
    flattenWithPrefix(commonId as Record<string, string>, "common"),
    flattenWithPrefix(accountId as Record<string, string>, "account"),
  ),
};
