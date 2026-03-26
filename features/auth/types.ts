// Add account-specific types here as the feature is developed.

export type AccountStatus = "active" | "inactive" | "frozen";

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
}

// Local dummy auth types
export interface LocalAuthAccount {
  id: string;
  name: string;
  phone: string;
  password: string;
  createdAt: string;
}

export interface LocalAuthSession {
  accountId: string;
  createdAt: string;
}
