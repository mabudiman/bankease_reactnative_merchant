export type CurrencyEntry = {
  code: string;
  label: string;
  rate: number;
};

/** Base currency: USD = 1 */
export const CURRENCY_LIST: CurrencyEntry[] = [
  { code: "AUD", label: "AUD (Australian Dollar)", rate: 1.53 },
  { code: "CNY", label: "CNY (Chinese Yuan)", rate: 7.24 },
  { code: "EUR", label: "EUR (Euro)", rate: 0.92 },
  { code: "GBP", label: "GBP (British Pound Sterling)", rate: 0.79 },
  { code: "IDR", label: "IDR (Indonesian Rupiah)", rate: 16350 },
  { code: "JPY", label: "JPY (Japanese Yen)", rate: 149.5 },
  { code: "MYR", label: "MYR (Malaysian Ringgit)", rate: 4.72 },
  { code: "SAR", label: "SAR (Saudi Riyal)", rate: 3.75 },
  { code: "SGD", label: "SGD (Singapore Dollar)", rate: 1.34 },
  { code: "USD", label: "USD (United States Dollar)", rate: 1 },
];

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
