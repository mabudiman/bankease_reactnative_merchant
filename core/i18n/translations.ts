import type { TranslationsByLocale, TranslationMap } from "./types";
import commonEn from "./locales/en.json";
import commonId from "./locales/id.json";
import accountEn from "@/features/account/locales/en.json";
import accountId from "@/features/account/locales/id.json";
import searchEn from "@/features/search/locales/en.json";
import searchId from "@/features/search/locales/id.json";
import authEn from "@/features/auth/locales/en.json";
import authId from "@/features/auth/locales/id.json";
import dashboardEn from "@/features/dashboard/locales/en.json";
import dashboardId from "@/features/dashboard/locales/id.json";
import profileEn from "@/features/profile/locales/en.json";
import profileId from "@/features/profile/locales/id.json";
import messagesEn from "@/features/messages/locales/en.json";
import messagesId from "@/features/messages/locales/id.json";
import transferEn from "@/features/transfer/locales/en.json";
import transferId from "@/features/transfer/locales/id.json";
import mobilePrepaidEn from "@/features/mobile-prepaid/locales/en.json";
import mobilePrepaidId from "@/features/mobile-prepaid/locales/id.json";

function flattenWithPrefix(obj: Record<string, string>, prefix: string): TranslationMap {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${prefix}.${k}`, v]));
}

function merge(...maps: TranslationMap[]): TranslationMap {
  return Object.assign({}, ...maps);
}

export const translations: TranslationsByLocale = {
  en: merge(
    flattenWithPrefix(commonEn as Record<string, string>, "common"),
    flattenWithPrefix(accountEn as Record<string, string>, "account"),
    flattenWithPrefix(searchEn as Record<string, string>, "searchScreen"),
    flattenWithPrefix(authEn as Record<string, string>, "auth"),
    flattenWithPrefix(dashboardEn as Record<string, string>, "dashboard"),
    flattenWithPrefix(profileEn as Record<string, string>, "profile"),
    flattenWithPrefix(messagesEn as Record<string, string>, "messages"),
    flattenWithPrefix(transferEn as Record<string, string>, "transfer"),
    flattenWithPrefix(mobilePrepaidEn as Record<string, string>, "mobilePrepaid"),
  ),
  id: merge(
    flattenWithPrefix(commonId as Record<string, string>, "common"),
    flattenWithPrefix(accountId as Record<string, string>, "account"),
    flattenWithPrefix(searchId as Record<string, string>, "searchScreen"),
    flattenWithPrefix(authId as Record<string, string>, "auth"),
    flattenWithPrefix(dashboardId as Record<string, string>, "dashboard"),
    flattenWithPrefix(profileId as Record<string, string>, "profile"),
    flattenWithPrefix(messagesId as Record<string, string>, "messages"),
    flattenWithPrefix(transferId as Record<string, string>, "transfer"),
    flattenWithPrefix(mobilePrepaidId as Record<string, string>, "mobilePrepaid"),
  ),
};
