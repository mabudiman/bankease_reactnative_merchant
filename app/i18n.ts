import type { TranslationsByLocale, TranslationMap } from "@/core/i18n";
import commonEn from "@/core/i18n/locales/en.json";
import commonId from "@/core/i18n/locales/id.json";
import accountEn from "@/features/account/locales/en.json";
import accountId from "@/features/account/locales/id.json";
import authEn from "@/features/auth/locales/en.json";
import authId from "@/features/auth/locales/id.json";
import dashboardEn from "@/features/dashboard/locales/en.json";
import dashboardId from "@/features/dashboard/locales/id.json";
import profileEn from "@/features/profile/locales/en.json";
import profileId from "@/features/profile/locales/id.json";

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
    flattenWithPrefix(authEn as Record<string, string>, "auth"),
    flattenWithPrefix(dashboardEn as Record<string, string>, "dashboard"),
    flattenWithPrefix(profileEn as Record<string, string>, "profile"),
  ),
  id: merge(
    flattenWithPrefix(commonId as Record<string, string>, "common"),
    flattenWithPrefix(accountId as Record<string, string>, "account"),
    flattenWithPrefix(authId as Record<string, string>, "auth"),
    flattenWithPrefix(dashboardId as Record<string, string>, "dashboard"),
    flattenWithPrefix(profileId as Record<string, string>, "profile"),
  ),
};
