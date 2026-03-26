export type AccountStatus = "active" | "inactive" | "frozen";

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export type AccountType = 'REGULAR' | 'PREMIUM';

/** Menu item shape returned by GET /api/menu and GET /api/menu/{accountType}. */
export interface MenuItem {
  id: string;
  index: number;
  type: AccountType;
  title: string;
  icon_url: string;
  is_active: boolean;
}
