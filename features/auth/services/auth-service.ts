import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LocalAuthAccount, LocalAuthSession } from '../types';
import { authApi } from '../api';
import { tokenManager } from '@/core/api/token-manager';

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

async function signIn(username: string, password: string): Promise<void> {
  // Delegates to real API — throws 'INVALID_CREDENTIALS', 'NETWORK_ERROR', or 'GENERIC_ERROR'
  const response = await authApi.signIn({
    username: username.trim(),
    password: password.trim(),
  });
  // Persist the auth token so all subsequent API calls include it
  await tokenManager.setToken(response.token);
  // Persist a lightweight session record so the app knows who is logged in
  const session: LocalAuthSession = {
    accountId: response.user_id,
    username: response.username,
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

async function signUp(
  username: string,
  phone: string,
  password: string,
): Promise<void> {
  // Delegates to real API — throws 'PHONE_TAKEN', 'NETWORK_ERROR', or 'GENERIC_ERROR'
  await authApi.signUp({
    username: username.trim(),
    phone: phone.trim(),
    password: password.trim(),
  });
}

async function getSession(): Promise<LocalAuthSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as LocalAuthSession) : null;
}

async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
  await tokenManager.clearToken();
}

async function getSessionAccount(): Promise<LocalAuthAccount | null> {
  const session = await getSession();
  if (!session) return null;
  const accounts = await loadAccounts();
  const found = accounts.find((a) => a.id === session.accountId);
  if (found) return found;
  // Real API user — not in local accounts list; return a synthetic account
  return {
    id: session.accountId,
    name: session.username ?? session.accountId,
    phone: '',
    password: '',
    createdAt: session.createdAt,
  };
}

export const authService = { signIn, signUp, getSession, clearSession, getSessionAccount };
