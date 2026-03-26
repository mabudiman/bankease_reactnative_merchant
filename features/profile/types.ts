export interface UserProfile {
  accountId: string;
  bankName: string;
  branchName: string;
  transactionName: string;
  cardNumber: string;
  cardProvider: string;
  balance: number; // minor units
  currency: string;
  accountType: string;
  image?: string;
}

/** accountType and balance are read-only from the server, so omit them from edit payloads */
export type UserProfileInput = Omit<UserProfile, 'accountId' | 'accountType' | 'balance' | 'image'>;
