import { request } from '@/core/api/client';
import type { UserProfile, UserProfileInput } from '../types';

// ─── API response shape (snake_case, matches server contract) ─────────────────

interface ApiProfileResponse {
  id: string;
  bank: string;
  branch: string;
  name: string;
  card_number: string;
  card_provider: string;
  balance: number;
  currency: string;
  accountType?: string;  // camelCase from server
  image?: string;
}

interface UpdateProfilePayload {
  bank: string;
  branch: string;
  name: string;
  card_number: string;
  card_provider: string;
  currency: string;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapResponseToProfile(accountId: string, res: ApiProfileResponse): UserProfile {
  return {
    accountId: res.id ?? accountId,
    bankName: res.bank ?? '',
    branchName: res.branch ?? '',
    transactionName: res.name ?? '',
    cardNumber: res.card_number ?? '',
    cardProvider: res.card_provider ?? '',
    balance: (res.balance ?? 0) * 100, // convert major units → minor units
    currency: res.currency ?? '',
    accountType: res.accountType ?? '',
    image: res.image,
  };
}

function mapInputToPayload(data: UserProfileInput): UpdateProfilePayload {
  return {
    bank: data.bankName,
    branch: data.branchName,
    name: data.transactionName,
    card_number: data.cardNumber,
    card_provider: data.cardProvider,
    currency: data.currency,
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getProfile(accountId: string): Promise<UserProfile> {
  const res = await request<ApiProfileResponse>(`/api/profile`);
  return mapResponseToProfile(accountId, res);
}

export async function updateProfile(
  accountId: string,
  data: UserProfileInput,
): Promise<UserProfile> {
  const res = await request<ApiProfileResponse>(`/api/profile/${accountId}`, {
    method: 'PUT',
    body: JSON.stringify(mapInputToPayload(data)),
  });
  return mapResponseToProfile(accountId, res);
}

export const profileApi = { getProfile, updateProfile };
