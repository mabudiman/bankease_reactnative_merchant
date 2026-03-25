// Add account-specific types here as the feature is developed.

export type AccountStatus = "active" | "inactive" | "frozen";

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
}
