import { profileService } from '../profile-service';
import { profileApi } from '../../api/profile-api';
import type { UserProfile } from '../../types';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('../../api/profile-api');

const mockGetProfile = profileApi.getProfile as jest.Mock;
const mockUpdateProfile = profileApi.updateProfile as jest.Mock;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeApiProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    accountId: 'da08ecfe-de3b-42b1-b1ce-018e144198f5',
    bankName: 'BRI',
    branchName: 'Jakarta',
    transactionName: 'Jane Doe',
    cardNumber: '1234567890',
    cardProvider: 'VISA',
    balance: 100000,
    currency: 'IDR',
    accountType: 'REGULAR',
    ...overrides,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('profileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── loadProfile ───────────────────────────────────────────────────────────

  describe('loadProfile', () => {
    it('resolves demo-001 to its UUID and calls the API', async () => {
      const apiResult = makeApiProfile();
      mockGetProfile.mockResolvedValue(apiResult);

      const profile = await profileService.loadProfile('demo-001');

      expect(mockGetProfile).toHaveBeenCalledWith('da08ecfe-de3b-42b1-b1ce-018e144198f5');
      expect(profile.bankName).toBe('BRI');
      expect(profile.transactionName).toBe('Jane Doe');
    });

    it('passes non-demo accountId directly to the API (sign-up UUID)', async () => {
      const uuid = 'some-new-user-uuid';
      const apiResult = makeApiProfile({ accountId: uuid });
      mockGetProfile.mockResolvedValue(apiResult);

      await profileService.loadProfile(uuid);

      expect(mockGetProfile).toHaveBeenCalledWith(uuid);
    });

    it('returns empty profile when API throws', async () => {
      mockGetProfile.mockRejectedValue(new Error('network error'));

      const profile = await profileService.loadProfile('demo-001');

      expect(profile.accountId).toBe('demo-001');
      expect(profile.bankName).toBe('');
      expect(profile.branchName).toBe('');
      expect(profile.transactionName).toBe('');
      expect(profile.cardNumber).toBe('');
    });

    it('returns the mapped profile on success', async () => {
      const apiResult = makeApiProfile({ bankName: 'Mandiri', branchName: 'Surabaya' });
      mockGetProfile.mockResolvedValue(apiResult);

      const profile = await profileService.loadProfile('demo-001');

      expect(profile.bankName).toBe('Mandiri');
      expect(profile.branchName).toBe('Surabaya');
    });
  });

  // ── saveProfile ───────────────────────────────────────────────────────────

  describe('saveProfile', () => {
    const INPUT = {
      bankName: 'DBS',
      branchName: 'Singapore',
      transactionName: 'Test User',
      cardNumber: '1111 2222 3333',
      cardProvider: 'VISA',
      currency: 'SGD',
    };

    it('resolves demo-001 to its UUID when calling updateProfile', async () => {
      mockUpdateProfile.mockResolvedValue(makeApiProfile({ ...INPUT }));

      await profileService.saveProfile('demo-001', INPUT);

      expect(mockUpdateProfile).toHaveBeenCalledWith(
        'da08ecfe-de3b-42b1-b1ce-018e144198f5',
        INPUT,
      );
    });

    it('returns the updated profile from the API', async () => {
      const updated = makeApiProfile({ bankName: 'DBS', branchName: 'Singapore' });
      mockUpdateProfile.mockResolvedValue(updated);

      const result = await profileService.saveProfile('demo-001', INPUT);

      expect(result.bankName).toBe('DBS');
      expect(result.branchName).toBe('Singapore');
    });

    it('throws when the API call fails', async () => {
      mockUpdateProfile.mockRejectedValue(new Error('server error'));

      await expect(profileService.saveProfile('demo-001', INPUT)).rejects.toThrow('server error');
    });
  });
});
