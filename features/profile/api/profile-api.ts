import { request } from '@/core/api/client';
import type { UserProfile, UserProfileInput } from '../types';

// ─── API response shape (snake_case, matches server contract) ─────────────────

interface ApiProfileResponse {
  id: string;
  user_id?: string;
  bank: string;
  branch: string;
  name: string;
  card_number?: string;
  card_provider?: string;
  balance?: number;
  currency: string;
  account_type?: string;  // snake_case from real server
  accountType?: string;   // camelCase fallback
  image?: string;
}

interface UpdateProfilePayload {
  id: string;
  bank: string;
  branch: string;
  name: string;
  card_number: string;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapResponseToProfile(accountId: string, res: ApiProfileResponse): UserProfile {
  return {
    accountId: res.id ?? accountId,
    bankName: res.bank ?? '',
    branchName: res.branch ?? '',
    transactionName: res.name ?? '',
    cardNumber: res.card_number ?? 'xxx',
    cardProvider: res.card_provider ?? res.bank ?? '',
    balance: (res.balance ?? 0) * 100, // convert major units → minor units
    currency: res.currency ?? '',
    accountType: res.account_type ?? res.accountType ?? '',
    image: res.image,
  };
}

function mapInputToPayload(accountId: string, data: UserProfileInput): UpdateProfilePayload {
  return {
    id: accountId,
    bank: data.bankName,
    branch: data.branchName,
    name: data.transactionName,
    card_number: data.cardNumber,
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getProfile(accountId: string): Promise<UserProfile> {
  console.log('[profileApi] GET /api/profile');
  const res = await request<ApiProfileResponse>(`/api/profile`);
  console.log('[profileApi] GET response:', JSON.stringify(res, null, 2));
  return mapResponseToProfile(accountId, res);
}

export async function updateProfile(
  accountId: string,
  data: UserProfileInput,
): Promise<UserProfile> {
  const payload = mapInputToPayload(accountId, data);
  console.log('[profileApi] PUT /api/profile/' + accountId);
  console.log('[profileApi] payload:', JSON.stringify(payload, null, 2));

  const res = await request<ApiProfileResponse>(`/api/profile/${accountId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  console.log('[profileApi] response:', JSON.stringify(res, null, 2));
  return mapResponseToProfile(accountId, res);
}

export const profileApi = { getProfile, updateProfile };
