import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../auth-service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => 'test-uuid-1234'),
}));

// Mock the real API layer so tests don't make network calls
jest.mock('../../api', () => ({
  authApi: {
    signIn: jest.fn(),
    signUp: jest.fn(),
  },
}));

// Mock the token manager — we only want to verify calls, not hit AsyncStorage twice
jest.mock('@/core/api/token-manager', () => ({
  tokenManager: {
    setToken: jest.fn().mockResolvedValue(undefined),
    clearToken: jest.fn().mockResolvedValue(undefined),
    getToken: jest.fn().mockReturnValue(null),
    loadToken: jest.fn().mockResolvedValue(undefined),
  },
}));

import { authApi } from '../../api';
import { tokenManager } from '@/core/api/token-manager';

const mockAuthApiSignIn = authApi.signIn as jest.Mock;
const mockAuthApiSignUp = authApi.signUp as jest.Mock;
const mockTokenManagerSetToken = tokenManager.setToken as jest.Mock;
const mockTokenManagerClearToken = tokenManager.clearToken as jest.Mock;

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setupEmptyStorage() {
  mockGetItem.mockResolvedValue(null);
  mockSetItem.mockResolvedValue(undefined);
  mockRemoveItem.mockResolvedValue(undefined);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupEmptyStorage();
  });

  // ── signIn ────────────────────────────────────────────────────────────────

  describe('signIn', () => {
    it('resolves when API returns a token', async () => {
      mockAuthApiSignIn.mockResolvedValueOnce({ token: 'fake-jwt-token', user_id: 'user-123' });
      await expect(authService.signIn('merchant01', 'pass123')).resolves.toBeUndefined();
    });

    it('stores the token via tokenManager on success', async () => {
      mockAuthApiSignIn.mockResolvedValueOnce({ token: 'abc.def.ghi', user_id: 'user-456' });
      await authService.signIn('merchant01', 'pass123');
      expect(mockTokenManagerSetToken).toHaveBeenCalledWith('abc.def.ghi');
    });

    it('stores session with user_id as accountId in AsyncStorage on success', async () => {
      mockAuthApiSignIn.mockResolvedValueOnce({ token: 'tok', user_id: 'user-789' });
      await authService.signIn('merchant01', 'pass123');
      const sessionCall = mockSetItem.mock.calls.find(([key]) => key === '@auth:session');
      expect(sessionCall).toBeDefined();
      const stored = JSON.parse(sessionCall[1]);
      expect(stored.accountId).toBe('user-789');
    });

    it('trims username and password before sending to API', async () => {
      mockAuthApiSignIn.mockResolvedValueOnce({ token: 'tok', user_id: 'u1' });
      await authService.signIn('  user  ', '  pass  ');
      expect(mockAuthApiSignIn).toHaveBeenCalledWith({ username: 'user', password: 'pass' });
    });

    it('throws INVALID_CREDENTIALS when API throws INVALID_CREDENTIALS', async () => {
      mockAuthApiSignIn.mockRejectedValueOnce(new Error('INVALID_CREDENTIALS'));
      await expect(authService.signIn('user', 'wrongpass')).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('throws NETWORK_ERROR when API throws NETWORK_ERROR', async () => {
      mockAuthApiSignIn.mockRejectedValueOnce(new Error('NETWORK_ERROR'));
      await expect(authService.signIn('user', 'pass')).rejects.toThrow('NETWORK_ERROR');
    });

    it('does not store token or session when API fails', async () => {
      mockAuthApiSignIn.mockRejectedValueOnce(new Error('INVALID_CREDENTIALS'));
      await authService.signIn('user', 'bad').catch(() => {});
      expect(mockTokenManagerSetToken).not.toHaveBeenCalled();
      expect(mockSetItem).not.toHaveBeenCalledWith('@auth:session', expect.anything());
    });  });

  // ── signUp ────────────────────────────────────────────────────────────────

  describe('signUp', () => {
    it('resolves without error on successful API call', async () => {
      mockAuthApiSignUp.mockResolvedValueOnce({ message: 'created' });
      await expect(authService.signUp('Alice', '082111222333', 'mypassword')).resolves.toBeUndefined();
    });

    it('passes trimmed values to the API', async () => {
      mockAuthApiSignUp.mockResolvedValueOnce({});
      await authService.signUp('  Bob  ', '  082999000111  ', '  pass123  ');
      expect(mockAuthApiSignUp).toHaveBeenCalledWith({
        username: 'Bob',
        phone: '082999000111',
        password: 'pass123',
      });
    });

    it('throws PHONE_TAKEN when API throws PHONE_TAKEN', async () => {
      mockAuthApiSignUp.mockRejectedValueOnce(new Error('PHONE_TAKEN'));
      await expect(authService.signUp('User', '081234567890', 'pw')).rejects.toThrow('PHONE_TAKEN');
    });

    it('throws NETWORK_ERROR on network failure', async () => {
      mockAuthApiSignUp.mockRejectedValueOnce(new Error('NETWORK_ERROR'));
      await expect(authService.signUp('User', '082111000222', 'pw')).rejects.toThrow('NETWORK_ERROR');
    });
  });

  // ── getSession ────────────────────────────────────────────────────────────

  describe('getSession', () => {
    it('returns null when no session exists', async () => {
      const session = await authService.getSession();
      expect(session).toBeNull();
    });

    it('returns the stored session object', async () => {
      const stored = { accountId: 'user-123', createdAt: '2026-01-01T00:00:00.000Z' };
      mockGetItem.mockImplementation(async (key: string) => {
        if (key === '@auth:session') return JSON.stringify(stored);
        return null;
      });
      const session = await authService.getSession();
      expect(session).not.toBeNull();
      expect(session?.accountId).toBe('user-123');
    });
  });

  // ── clearSession ──────────────────────────────────────────────────────────

  describe('clearSession', () => {
    it('removes session from AsyncStorage', async () => {
      await authService.clearSession();
      expect(mockRemoveItem).toHaveBeenCalledWith('@auth:session');
    });

    it('clears token via tokenManager', async () => {
      await authService.clearSession();
      expect(mockTokenManagerClearToken).toHaveBeenCalled();
    });
  });

  // ── getSessionAccount ─────────────────────────────────────────────────────

  describe('getSessionAccount', () => {
    it('returns null when there is no session', async () => {
      const account = await authService.getSessionAccount();
      expect(account).toBeNull();
    });

    it('returns the seed account for a matching session accountId', async () => {
      const session = { accountId: 'demo-001', createdAt: '2026-01-01T00:00:00.000Z' };
      mockGetItem.mockImplementation(async (key: string) => {
        if (key === '@auth:session') return JSON.stringify(session);
        if (key === '@auth:accounts') return null; // triggers seed load
        return null;
      });
      const account = await authService.getSessionAccount();
      expect(account).not.toBeNull();
      expect(account?.id).toBe('demo-001');
      expect(account?.name).toBe('Demo Merchant');
    });

    it('returns null when session accountId does not match any account', async () => {
      const session = { accountId: 'nonexistent-id', createdAt: '2026-01-01T00:00:00.000Z' };
      mockGetItem.mockImplementation(async (key: string) => {
        if (key === '@auth:session') return JSON.stringify(session);
        if (key === '@auth:accounts') return null;
        return null;
      });
      const account = await authService.getSessionAccount();
      expect(account).toBeNull();
    });
  });
});

