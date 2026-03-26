import { request } from "@/core/api/client";
import type { Branch, ExchangeRate, InterestRate } from "../types";

export async function getExchangeRates(): Promise<ExchangeRate[]> {
  return request<ExchangeRate[]>("/api/exchange-rates");
}

export async function getInterestRates(): Promise<InterestRate[]> {
  return request<InterestRate[]>("/api/interest-rates");
}

export async function getBranches(query: string): Promise<Branch[]> {
  const q = encodeURIComponent(query);
  return request<Branch[]>(`/api/branches?q=${q}`);
}
