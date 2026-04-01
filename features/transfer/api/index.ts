import { request } from '@/core/api/client';
import type { TransferCard, Beneficiary, BankItem, BranchItem, TransferPayload, TransferResult } from '../types';

export async function getTransferCards(): Promise<TransferCard[]> {
  return request<TransferCard[]>('/api/cards');
}

export async function getBeneficiaries(): Promise<Beneficiary[]> {
  return request<Beneficiary[]>('/api/beneficiaries');
}

export async function getBankList(): Promise<BankItem[]> {
  return request<BankItem[]>('/api/banks');
}

export async function getBankBranches(bankId: string): Promise<BranchItem[]> {
  return request<BranchItem[]>(`/api/banks/${bankId}/branches`);
}

export async function submitTransfer(payload: TransferPayload): Promise<TransferResult> {
  return request<TransferResult>('/api/transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export const transferApi = {
  getTransferCards,
  getBeneficiaries,
  getBankList,
  getBankBranches,
  submitTransfer,
};
