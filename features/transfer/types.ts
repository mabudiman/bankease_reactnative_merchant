export type TransferType = 'CARD_NUMBER' | 'SAME_BANK' | 'ANOTHER_BANK';

export interface TransferCard {
  id: string;
  brand: 'VISA' | 'MASTERCARD';
  maskedNumber: string;
  balance: number; // minor units
  currency: string;
  holderName: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  avatarUrl: string;
  cardNumber?: string;
  accountNumber?: string;
}

export interface BankItem {
  id: string;
  name: string;
}

export interface BranchItem {
  id: string;
  bankId: string;
  name: string;
}

// ─── Form data shapes ────────────────────────────────────────────────────────

export interface CardNumberFormData {
  name: string;
  cardNumber: string;
  amount: string;
  content: string;
}

export interface SameBankFormData {
  name: string;
  accountNumber: string;
  amount: string;
  content: string;
}

export interface AnotherBankFormData {
  bankId: string;
  bankName: string;
  branchId: string;
  branchName: string;
  name: string;
  cardNumber: string;
  amount: string;
  note: string;
}

export interface TransferPayload {
  sourceCardId: string;
  transferType: TransferType;
  formData: CardNumberFormData | SameBankFormData | AnotherBankFormData;
  saveToDirectory: boolean;
}

export interface TransferResult {
  id: string;
  status: 'success' | 'failed';
}
