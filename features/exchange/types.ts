// Add exchange-specific types here as the feature is developed.

export type ExchangeStatus = "pending" | "completed" | "failed" | "cancelled";

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  updatedAt: string;
}

export interface ExchangeRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface ExchangeResult {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  status: ExchangeStatus;
  createdAt: string;
}
