export type { CurrencyEntry } from "@/features/search/types";
import { CURRENCY_LIST } from "@/mocks/data";
export { CURRENCY_LIST };

/** Map of currency code → rate for quick lookup */
export const RATES: Record<string, number> = Object.fromEntries(
  CURRENCY_LIST.map(({ code, rate }) => [code, rate]),
);

export const CURRENCIES = CURRENCY_LIST.map(({ code }) => code).sort();

export function convertAmount(amount: number, from: string, to: string): number {
  const inUSD = amount / RATES[from];
  return inUSD * RATES[to];
}

export function formatResult(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
