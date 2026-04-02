// features/mobile-prepaid/types.ts

export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface AmountOption {
  value: number; // minor units (cents)
  label: string; // display: "$10"
}

export interface PrepaidPaymentRequest {
  cardId: string;
  phone: string;
  amount: number; // minor units
  idempotencyKey: string;
}

export interface PrepaidPaymentResponse {
  id: string;
  status: "SUCCESS" | "FAILED";
  message: string;
  timestamp: string;
}

export const AMOUNT_OPTIONS: AmountOption[] = [
  { value: 1000, label: "$10" },
  { value: 2000, label: "$20" },
  { value: 3000, label: "$30" },
];
