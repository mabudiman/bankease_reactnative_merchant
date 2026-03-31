export interface Beneficiary {
  id: string;
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
}

export interface PrepaidPurchaseRequest {
  cardId: string;
  beneficiaryId?: string;
  phoneNumber: string;
  /** Amount in minor units (cents) */
  amount: number;
}

export interface PrepaidPurchaseResponse {
  id: string;
  status: "success" | "failed";
  message: string;
}

export interface PrepaidAmountOption {
  label: string;
  /** Amount in minor units (cents) */
  value: number;
}
