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
    mockSaveProfile.mockResolvedValue(undefined);
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
    expect(mockSaveProfile).toHaveBeenCalledWith('demo-001', PROFILE_INPUT);
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
});
