import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PaymentCard, Privilege } from '../types';

const CARDS_KEY = '@dashboard:cards';

// ─── Seed card data per account ───────────────────────────────────────────────

const SEED_CARDS: Record<string, PaymentCard[]> = {
  'demo-001': [
    {
      id: 'card-001-1',
      accountId: 'demo-001',
      holderName: 'John Smith',
      cardLabel: 'Amazon Platinium',
      maskedNumber: '4756  ••••  ••••  9018',
      balance: 346952,
      currency: 'USD',
      brand: 'VISA',
      gradientColors: ['#1A1563', '#1E2FA0', '#3B7ED4'],
    },
    {
      id: 'card-001-2',
      accountId: 'demo-001',
      holderName: 'John Smith',
      cardLabel: 'Gold Card',
      maskedNumber: '5281  ••••  ••••  4471',
      balance: 123400,
      currency: 'USD',
      brand: 'MASTERCARD',
      gradientColors: ['#2D1B69', '#5B2D8E', '#8E4EC6'],
    },
  ],
  'demo-002': [
    {
      id: 'card-002-1',
      accountId: 'demo-002',
      holderName: 'Premium Merchant',
      cardLabel: 'Platinum Business',
      maskedNumber: '4539  ••••  ••••  8812',
      balance: 987650,
      currency: 'USD',
      brand: 'VISA',
      gradientColors: ['#0A3D2B', '#1A6B3C', '#27AE60'],
    },
    {
      id: 'card-002-2',
      accountId: 'demo-002',
      holderName: 'Premium Merchant',
      cardLabel: 'Corporate Black',
      maskedNumber: '5567  ••••  ••••  3301',
      balance: 524000,
      currency: 'USD',
      brand: 'MASTERCARD',
      gradientColors: ['#0D0821', '#1A0A3D', '#3D1A8F'],
    },
  ],
};

// ─── Privilege definitions ────────────────────────────────────────────────────

const ALL_PRIVILEGE_CODES = [
  'ACCOUNT_CARD',
  'TRANSFER',
  'WITHDRAW',
  'MOBILE_PREPAID',
  'PAY_BILL',
  'SAVE_ONLINE',
  'CREDIT_CARD',
  'TRANSACTION_REPORT',
  'BENEFICIARY',
] as const;

type PrivilegeCode = (typeof ALL_PRIVILEGE_CODES)[number];

interface PrivilegeDefinition {
  code: PrivilegeCode;
  title: string;
  icon: string;
  color: string;
}

const PRIVILEGE_DEFINITIONS: PrivilegeDefinition[] = [
  { code: 'ACCOUNT_CARD', title: 'Account and Card', icon: 'card', color: '#3629B7' },
  { code: 'TRANSFER', title: 'Transfer', icon: 'swap-horizontal', color: '#1A73E8' },
  { code: 'WITHDRAW', title: 'Withdraw', icon: 'cash', color: '#F4511E' },
  { code: 'MOBILE_PREPAID', title: 'Mobile prepaid', icon: 'phone-portrait', color: '#E91E63' },
  { code: 'PAY_BILL', title: 'Pay the bill', icon: 'receipt', color: '#00897B' },
  { code: 'SAVE_ONLINE', title: 'Save online', icon: 'save', color: '#039BE5' },
  { code: 'CREDIT_CARD', title: 'Credit card', icon: 'card-outline', color: '#FB8C00' },
  { code: 'TRANSACTION_REPORT', title: 'Transaction report', icon: 'bar-chart', color: '#8E24AA' },
  { code: 'BENEFICIARY', title: 'Beneficiary', icon: 'people', color: '#43A047' },
];

// ─── Role map: which privilege codes are enabled per account ──────────────────

const ROLE_MAP: Record<string, Set<PrivilegeCode>> = {
  'demo-001': new Set(['ACCOUNT_CARD', 'TRANSFER', 'TRANSACTION_REPORT']),
  'demo-002': new Set(ALL_PRIVILEGE_CODES),
};

const DEFAULT_ROLE: Set<PrivilegeCode> = new Set(['ACCOUNT_CARD']);

// ─── loadCards ───────────────────────────────────────────────────────────────

async function loadCards(accountId: string): Promise<PaymentCard[]> {
  const raw = await AsyncStorage.getItem(CARDS_KEY);
  const stored: PaymentCard[] = raw ? (JSON.parse(raw) as PaymentCard[]) : [];

  const seedForAccount = SEED_CARDS[accountId] ?? [];

  // Upsert seed cards that are missing from storage
  let changed = false;
  const updated = [...stored];
  for (const seed of seedForAccount) {
    if (!updated.some((c) => c.id === seed.id)) {
      updated.push(seed);
      changed = true;
    }
  }

  if (changed || raw === null) {
    await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(updated));
  }

  return updated.filter((c) => c.accountId === accountId);
}

// ─── getPrivileges ────────────────────────────────────────────────────────────

function getPrivileges(accountId: string): Privilege[] {
  const enabledCodes = ROLE_MAP[accountId] ?? DEFAULT_ROLE;
  return PRIVILEGE_DEFINITIONS.map((def) => ({
    code: def.code,
    title: def.title,
    icon: def.icon,
    color: def.color,
    enabled: enabledCodes.has(def.code),
  }));
}

// ─── getNotificationCount ─────────────────────────────────────────────────────

async function getNotificationCount(accountId: string): Promise<number> {
  const key = `@dashboard:notifications:${accountId}`;
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) {
    await AsyncStorage.setItem(key, JSON.stringify(3));
    return 3;
  }
  return JSON.parse(raw) as number;
}

export const dashboardService = { loadCards, getPrivileges, getNotificationCount };
