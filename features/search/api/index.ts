import { request } from "@/core/api/client";
import type { Branch, ExchangeRate, InterestRate } from "../types";

type ExchangeRateRaw = Omit<ExchangeRate, "countryCode"> & { country_code: string };

export async function getExchangeRates(): Promise<ExchangeRate[]> {
  const data = await request<{ exchange_rates: ExchangeRateRaw[] }>("/api/exchange-rates");
  return data.exchange_rates.map(({ country_code, ...rest }) => ({
    ...rest,
    countryCode: country_code,
  }));
}

export async function getInterestRates(): Promise<InterestRate[]> {
  const data = await request<{ interest_rates: InterestRate[] }>("/api/interest-rates");
  return data.interest_rates;
}

export async function getBranches(query: string): Promise<Branch[]> {
  const q = encodeURIComponent(query);
  const data = await request<{ branches: Branch[] }>(`/api/branches?q=${q}`);
  return data.branches;
}
