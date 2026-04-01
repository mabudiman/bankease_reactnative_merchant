import { useQuery } from "@tanstack/react-query";
import { getProviders, getInternetBillDetail } from "../api";
import type { BillCategory } from "../types";

export function useProviders(category?: BillCategory) {
  return useQuery({
    queryKey: ["pay-the-bill-providers", category],
    queryFn: () => getProviders(category),
  });
}

export function useInternetBillDetail() {
  return useQuery({
    queryKey: ["internet-bill-detail"],
    queryFn: getInternetBillDetail,
  });
}
