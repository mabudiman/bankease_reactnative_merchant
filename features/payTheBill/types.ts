// Add payTheBill-specific types here as the feature is developed.

export type BillStatus = "pending" | "paid" | "failed" | "cancelled";

export interface Bill {
  id: string;
  category: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: BillStatus;
}

export interface PayBillRequest {
  billId: string;
  amount: number;
  currency: string;
}

export interface PayBillResult {
  id: string;
  billId: string;
  amount: number;
  currency: string;
  status: BillStatus;
  paidAt: string;
}
