import { transferApi } from '../api';
import type { TransferPayload } from '../types';

export const transferService = {
  loadCards: () => transferApi.getTransferCards(),
  loadBeneficiaries: () => transferApi.getBeneficiaries(),
  loadBankList: () => transferApi.getBankList(),
  loadBankBranches: (bankId: string) => transferApi.getBankBranches(bankId),
  submitTransfer: (payload: TransferPayload) => transferApi.submitTransfer(payload),
};
