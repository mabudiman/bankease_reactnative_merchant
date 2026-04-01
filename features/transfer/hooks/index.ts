import { useQuery, useMutation } from '@tanstack/react-query';
import { transferApi } from '../api';
import type { TransferPayload } from '../types';

export function useTransferCards() {
  return useQuery({
    queryKey: ['transfer-cards'],
    queryFn: transferApi.getTransferCards,
  });
}

export function useBeneficiaries() {
  return useQuery({
    queryKey: ['beneficiaries'],
    queryFn: transferApi.getBeneficiaries,
  });
}

export function useBankList() {
  return useQuery({
    queryKey: ['banks'],
    queryFn: transferApi.getBankList,
  });
}

export function useBankBranches(bankId: string | null) {
  return useQuery({
    queryKey: ['bank-branches', bankId],
    queryFn: () => transferApi.getBankBranches(bankId!),
    enabled: !!bankId,
  });
}

export function useSubmitTransfer() {
  return useMutation({
    mutationFn: (payload: TransferPayload) => transferApi.submitTransfer(payload),
  });
}
