import { profileApi } from '../api/profile-api';
import type { UserProfile, UserProfileInput } from '../types';

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
    return await profileApi.getProfile(accountId);
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
  return profileApi.updateProfile(accountId, data);
}

export const profileService = { loadProfile, saveProfile };
