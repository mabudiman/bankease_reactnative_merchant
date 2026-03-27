import { useQuery } from "@tanstack/react-query";
import { getBranches, getExchangeRates, getInterestRates } from "../api";

export function useExchangeRates() {
  return useQuery({
    queryKey: ["exchange-rates"],
    queryFn: getExchangeRates,
  });
}

export function useInterestRates() {
  return useQuery({
    queryKey: ["interest-rates"],
    queryFn: getInterestRates,
  });
}

export function useBranches(query: string) {
  return useQuery({
    queryKey: ["branches", query],
    queryFn: () => getBranches(query),
  });
}
