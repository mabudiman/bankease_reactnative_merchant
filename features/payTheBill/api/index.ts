import { request } from "@/core/api/client";
import type { BillCategory, InternetBillDetail, Provider } from "../types";

export async function getProviders(category?: BillCategory): Promise<Provider[]> {
  const query = category ? `?category=${category}` : "";
  return request<Provider[]>(`/api/pay-the-bill/providers${query}`);
}

export async function getInternetBillDetail(): Promise<InternetBillDetail> {
  return request<InternetBillDetail>("/api/pay-the-bill/internet-bill");
}
