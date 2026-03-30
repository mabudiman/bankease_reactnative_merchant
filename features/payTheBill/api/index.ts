import { request } from "@/core/api/client";
import type { InternetBillDetail, Provider } from "../types";

export async function getProviders(): Promise<Provider[]> {
  return request<Provider[]>("/api/pay-the-bill/providers");
}

export async function getInternetBillDetail(): Promise<InternetBillDetail> {
  return request<InternetBillDetail>("/api/pay-the-bill/internet-bill");
}
