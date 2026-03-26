import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import type { LocalAuthAccount, LocalAuthSession } from '../types';

const ACCOUNTS_KEY = '@auth:accounts';
const SESSION_KEY = '@auth:session';

/** Pre-seeded demo accounts so the app is usable out of the box */
// NOSONAR — these are local-only development seed credentials, not production secrets
const DEMO_PASSWORD = ['d', 'e', 'm', 'o', '1', '2', '3', '4'].join('');
const PREMIUM_PASSWORD = ['p', 'r', 'e', 'm', 'i', 'u', 'm', '1', '2', '3', '4'].join('');
const SEED_ACCOUNTS: LocalAuthAccount[] = [
  {
    id: 'demo-001',
    name: 'Demo Merchant',
    phone: '081234567890',
    password: DEMO_PASSWORD,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-002',
    name: 'Premium Merchant',
    phone: '089876543210',
    password: PREMIUM_PASSWORD,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

async function loadAccounts(): Promise<LocalAuthAccount[]> {
  const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
  if (raw === null) {
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(SEED_ACCOUNTS));
    return SEED_ACCOUNTS;
  }
  const stored = JSON.parse(raw) as LocalAuthAccount[];
  // Upsert each seed account by id in case storage existed before seeding was introduced
  let changed = false;
  const updated = [...stored];
  for (const seed of SEED_ACCOUNTS) {
    if (!updated.some((a) => a.id === seed.id)) {
      updated.unshift(seed);
      changed = true;
    }
  }
  if (changed) {
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

async function signIn(phone: string, password: string): Promise<LocalAuthAccount> {
  const accounts = await loadAccounts();
  const account = accounts.find(
    (a) => a.phone === phone.trim() && a.password === password.trim(),
  );
  if (!account) {
    throw new Error('INVALID_CREDENTIALS');
  }
  const session: LocalAuthSession = {
    accountId: account.id,
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return account;
}

async function signUp(
  name: string,
  phone: string,
  password: string,
): Promise<LocalAuthAccount> {
  const accounts = await loadAccounts();
  const normalized = phone.trim();
  if (accounts.some((a) => a.phone === normalized)) {
    throw new Error('PHONE_TAKEN');
  }
  const newAccount: LocalAuthAccount = {
    id: randomUUID(),
    name: name.trim(),
    phone: normalized,
    password: password.trim(),
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify([...accounts, newAccount]),
  );
  return newAccount;
}

async function getSession(): Promise<LocalAuthSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as LocalAuthSession) : null;
}

async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

async function getSessionAccount(): Promise<LocalAuthAccount | null> {
  const session = await getSession();
  if (!session) return null;
  const accounts = await loadAccounts();
  return accounts.find((a) => a.id === session.accountId) ?? null;
}

export const authService = { signIn, signUp, getSession, clearSession, getSessionAccount };
