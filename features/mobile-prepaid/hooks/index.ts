import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBeneficiaries, addBeneficiary, purchasePrepaid } from "../api";
import type { Beneficiary, PrepaidPurchaseRequest } from "../types";

export function useBeneficiaries() {
  return useQuery<Beneficiary[]>({
    queryKey: ["beneficiaries"],
    queryFn: getBeneficiaries,
  });
}

export function useAddBeneficiary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; phoneNumber: string }) => addBeneficiary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });
}

export function usePrepaidPurchase() {
  return useMutation({
    mutationFn: (data: PrepaidPurchaseRequest) => purchasePrepaid(data),
  });
}
