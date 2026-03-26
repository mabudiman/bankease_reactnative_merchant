import type { TranslationsByLocale, TranslationMap } from "./types";
import commonEn from "./locales/en.json";
import commonId from "./locales/id.json";
import accountEn from "@/features/account/locales/en.json";
import accountId from "@/features/account/locales/id.json";
import searchEn from "@/features/search/locales/en.json";
import searchId from "@/features/search/locales/id.json";

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
    flattenWithPrefix(searchEn as Record<string, string>, "searchScreen"),
  ),
  id: merge(
    flattenWithPrefix(commonId as Record<string, string>, "common"),
    flattenWithPrefix(accountId as Record<string, string>, "account"),
    flattenWithPrefix(searchId as Record<string, string>, "searchScreen"),
  ),
};
