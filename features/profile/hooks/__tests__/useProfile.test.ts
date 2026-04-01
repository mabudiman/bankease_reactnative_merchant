import { renderHook, waitFor } from '@testing-library/react-native';
import { createWrapper } from '@/test-utils/createWrapper';

// ─── Module mocks ─────────────────────────────────────────────────────────────

jest.mock('@/features/auth/services/auth-service', () => ({
  authService: {
    getSessionAccount: jest.fn(),
  },
}));

jest.mock('../../services/profile-service', () => ({
  profileService: {
    loadProfile: jest.fn(),
    saveProfile: jest.fn(),
  },
}));

import { useProfile } from '../useProfile';
import { authService } from '@/features/auth/services/auth-service';
import { profileService } from '../../services/profile-service';
import type { LocalAuthAccount } from '@/features/auth/types';
import type { UserProfile } from '../../types';

const mockGetSessionAccount = authService.getSessionAccount as jest.Mock;
const mockLoadProfile = profileService.loadProfile as jest.Mock;
const mockSaveProfile = profileService.saveProfile as jest.Mock;

const MOCK_USER: LocalAuthAccount = {
  id: 'demo-001',
  name: 'Demo Merchant',
  phone: '081234567890',
  password: 'demo1234',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const MOCK_PROFILE: UserProfile = {
  accountId: 'da08ecfe-de3b-42b1-b1ce-018e144198f5',
  bankName: 'BRI',
  branchName: 'Jakarta Pusat',
  transactionName: 'Demo Merchant',
  cardNumber: '1234567890123456',
  cardProvider: 'VISA',
  balance: 150000,
  currency: 'IDR',
  accountType: 'REGULAR',
};

const PROFILE_INPUT = {
  bankName: 'Mandiri',
  branchName: 'Surabaya',
  transactionName: 'Updated Name',
  cardNumber: '9999888877776666',
  cardProvider: 'MASTERCARD',
  currency: 'IDR',
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionAccount.mockResolvedValue(MOCK_USER);
    mockLoadProfile.mockResolvedValue(MOCK_PROFILE);
    mockSaveProfile.mockResolvedValue(MOCK_PROFILE);
  });

  it('starts in loading state', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('loads user and profile on mount', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toMatchObject({ id: 'demo-001' });
    expect(result.current.profile).toMatchObject({ bankName: 'BRI' });
  });

  it('calls loadProfile with user id', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockLoadProfile).toHaveBeenCalledWith('demo-001');
  });

  it('sets isLoading false when no session account', async () => {
    mockGetSessionAccount.mockResolvedValueOnce(null);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
  });

  it('saveProfile calls profileService.saveProfile with correct args', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const success = await result.current.saveProfile(PROFILE_INPUT);
    // Hook uses profile.accountId (from GET response), not the auth user's id
    expect(mockSaveProfile).toHaveBeenCalledWith(MOCK_PROFILE.accountId, PROFILE_INPUT);
    expect(success).toBe(true);
  });

  it('saveProfile returns false when no accountId available', async () => {
    mockGetSessionAccount.mockResolvedValueOnce(null);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const success = await result.current.saveProfile(PROFILE_INPUT);
    expect(success).toBe(false);
  });

  it('saveProfile returns false when profileService.saveProfile throws', async () => {
    mockSaveProfile.mockRejectedValueOnce(new Error('network error'));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const success = await result.current.saveProfile(PROFILE_INPUT);
    expect(success).toBe(false);
  });

  it('isSaving is false after saveProfile completes', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await result.current.saveProfile(PROFILE_INPUT);
    expect(result.current.isSaving).toBe(false);
  });

  it('cleanup cancels in-flight load (unmount before getSessionAccount resolves)', async () => {
    // Simulate a slow getSessionAccount — hook unmounts before it resolves
    let resolvePromise!: (v: typeof MOCK_USER | null) => void;
    mockGetSessionAccount.mockImplementationOnce(
      () => new Promise<typeof MOCK_USER | null>((res) => { resolvePromise = res; })
    );
    const { Wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useProfile(), { wrapper: Wrapper });

    // Immediately unmount before the async call resolves
    unmount();

    // Now resolve — the cancelled flag should prevent setState
    resolvePromise(null);

    // No crash; state stays as the initial (isLoading: true since cancelled)
    expect(result.current.isLoading).toBe(true);
  });

  it('cleanup cancels setState when unmount happens while loadProfile is in-flight', async () => {
    // getSessionAccount returns immediately, but loadProfile hangs
    let resolveLoadProfile!: (v: typeof MOCK_PROFILE) => void;
    mockGetSessionAccount.mockResolvedValueOnce(MOCK_USER);
    mockLoadProfile.mockImplementationOnce(
      () => new Promise<typeof MOCK_PROFILE>((res) => { resolveLoadProfile = res; })
    );

    const { Wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useProfile(), { wrapper: Wrapper });

    // Wait for getSessionAccount to complete but loadProfile still pending
    await new Promise(process.nextTick);

    // Unmount while loadProfile is still in-flight
    unmount();

    // Resolve loadProfile after unmount — cancelled flag prevents setState
    resolveLoadProfile(MOCK_PROFILE);

    // isLoading stays true since setState was prevented
    expect(result.current.isLoading).toBe(true);
  });
});

// ─── profileEvents coverage ───────────────────────────────────────────────────

import { profileEvents } from '../../profileEvents';

describe('profileEvents', () => {
  it('calls listener when emitProfileSaved fires', () => {
    const fn = jest.fn();
    const unsub = profileEvents.onProfileSaved(fn);
    profileEvents.emitProfileSaved();
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
  });

  it('unsubscribe prevents listener from being called', () => {
    const fn = jest.fn();
    const unsubscribe = profileEvents.onProfileSaved(fn);
    unsubscribe(); // covers the returned () => listeners.delete(fn) function
    profileEvents.emitProfileSaved();
    expect(fn).not.toHaveBeenCalled();
  });
});
