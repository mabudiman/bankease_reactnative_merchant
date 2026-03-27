export type CardBrand = 'VISA' | 'MASTERCARD';

export interface PaymentCard {
  id: string;
  accountId: string;
  holderName: string;
  cardLabel: string;
  maskedNumber: string;
  balance: number; // minor units (cents)
  currency: string;
  brand: CardBrand;
  gradientColors: string[];
}

export interface Privilege {
  code: string;
  title: string;
  icon: string; // Ionicons name
  enabled: boolean;
  color: string; // hex
}

export interface DashboardData {
  cards: PaymentCard[];
  privileges: Privilege[];
  notificationCount: number;
}
