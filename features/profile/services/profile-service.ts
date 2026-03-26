import { profileApi } from '../api/profile-api';
import type { UserProfile, UserProfileInput } from '../types';

/**
 * Maps local dummy-auth account IDs to their corresponding API profile UUIDs.
 * New accounts created via sign-up use randomUUID() directly (already UUID-shaped).
 */
const PROFILE_ID_MAP: Record<string, string> = {
  'demo-001': 'da08ecfe-de3b-42b1-b1ce-018e144198f5',
};

function resolveProfileId(accountId: string): string {
  return PROFILE_ID_MAP[accountId] ?? accountId;
}

const EMPTY_PROFILE: Omit<UserProfile, 'accountId'> = {
  bankName: '',
  branchName: '',
  transactionName: '',
  cardNumber: '',
  cardProvider: '',
  balance: 0,
  currency: '',
  accountType: '',
};

// ─── loadProfile ──────────────────────────────────────────────────────────────

/**
 * Loads the profile from the real API.
 * Returns an empty profile if the API call fails.
 */
export async function loadProfile(accountId: string): Promise<UserProfile> {
  try {
    return await profileApi.getProfile(resolveProfileId(accountId));
  } catch {
    return { ...EMPTY_PROFILE, accountId };
  }
}

// ─── saveProfile ──────────────────────────────────────────────────────────────

/**
 * Persists profile changes to the real API.
 * Throws on failure so the hook can show an error toast.
 */
export async function saveProfile(
  accountId: string,
  data: UserProfileInput,
): Promise<UserProfile> {
  return profileApi.updateProfile(resolveProfileId(accountId), data);
}

export const profileService = { loadProfile, saveProfile };
