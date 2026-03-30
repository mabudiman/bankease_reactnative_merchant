import { useQuery } from "@tanstack/react-query";
import { getProviders, getInternetBillDetail } from "../api";

export function useProviders() {
  return useQuery({
    queryKey: ["pay-the-bill-providers"],
    queryFn: getProviders,
  });
}

export function useInternetBillDetail() {
  return useQuery({
    queryKey: ["internet-bill-detail"],
    queryFn: getInternetBillDetail,
  });
}
