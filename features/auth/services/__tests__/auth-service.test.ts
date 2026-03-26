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

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setupEmptyStorage() {
  mockGetItem.mockResolvedValue(null);
  mockSetItem.mockResolvedValue(undefined);
  mockRemoveItem.mockResolvedValue(undefined);
}

function setupStorageWithAccounts(accounts: object[]) {
  mockGetItem.mockImplementation(async (key: string) => {
    if (key === '@auth:accounts') return JSON.stringify(accounts);
    return null;
  });
  mockSetItem.mockResolvedValue(undefined);
  mockRemoveItem.mockResolvedValue(undefined);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── signIn ────────────────────────────────────────────────────────────────

  describe('signIn', () => {
    it('returns account for valid demo-001 credentials', async () => {
      setupEmptyStorage();
      const account = await authService.signIn('081234567890', 'demo1234');
      expect(account.id).toBe('demo-001');
      expect(account.name).toBe('Demo Merchant');
    });

    it('returns account for valid demo-002 credentials', async () => {
      setupEmptyStorage();
      const account = await authService.signIn('089876543210', 'premium1234');
      expect(account.id).toBe('demo-002');
      expect(account.name).toBe('Premium Merchant');
    });

    it('throws INVALID_CREDENTIALS for wrong password', async () => {
      setupEmptyStorage();
      await expect(
        authService.signIn('081234567890', 'wrongpassword'),
      ).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('throws INVALID_CREDENTIALS for wrong phone', async () => {
      setupEmptyStorage();
      await expect(
        authService.signIn('099999999999', 'demo1234'),
      ).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('trims whitespace from phone and password before comparing', async () => {
      setupEmptyStorage();
      const account = await authService.signIn(' 081234567890 ', '  demo1234  ');
      expect(account.id).toBe('demo-001');
    });

    it('stores session after successful sign in', async () => {
      setupEmptyStorage();
      await authService.signIn('081234567890', 'demo1234');
      const sessionCall = mockSetItem.mock.calls.find(
        ([key]) => key === '@auth:session',
      );
      expect(sessionCall).toBeDefined();
      const stored = JSON.parse(sessionCall[1]);
      expect(stored.accountId).toBe('demo-001');
    });
  });

  // ── signUp ────────────────────────────────────────────────────────────────

  describe('signUp', () => {
    it('creates a new account for a new phone number', async () => {
      setupEmptyStorage();
      const account = await authService.signUp('Alice', '082111222333', 'mypassword');
      expect(account.id).toBe('test-uuid-1234');
      expect(account.name).toBe('Alice');
      expect(account.phone).toBe('082111222333');
    });

    it('throws PHONE_TAKEN when phone already exists', async () => {
      setupEmptyStorage();
      await expect(
        authService.signUp('New User', '081234567890', 'password123'),
      ).rejects.toThrow('PHONE_TAKEN');
    });

    it('stores trimmed name and password', async () => {
      setupEmptyStorage();
      await authService.signUp('  Bob  ', '082999000111', '  pass123  ');
      // Find the LAST setItem call for @auth:accounts (the signUp write, not the seed write)
      const accountsCalls = mockSetItem.mock.calls.filter(
        ([key]) => key === '@auth:accounts',
      );
      expect(accountsCalls.length).toBeGreaterThanOrEqual(1);
      const lastAccountsCall = accountsCalls[accountsCalls.length - 1];
      const stored = JSON.parse(lastAccountsCall[1]);
      const newAccount = stored.find((a: { id: string }) => a.id === 'test-uuid-1234');
      expect(newAccount).toBeDefined();
      expect(newAccount.name).toBe('Bob');
      expect(newAccount.password).toBe('pass123');
    });

    it('stores trimmed phone number', async () => {
      setupEmptyStorage();
      const account = await authService.signUp('Charlie', '  082555666777  ', 'pw');
      expect(account.phone).toBe('082555666777');
    });
  });

  // ── getSession ────────────────────────────────────────────────────────────

  describe('getSession', () => {
    it('returns null when no session exists', async () => {
      setupEmptyStorage();
      const session = await authService.getSession();
      expect(session).toBeNull();
    });

    it('returns session after sign in', async () => {
      setupEmptyStorage();
      await authService.signIn('081234567890', 'demo1234');

      // Re-mock getItem to return stored session
      mockGetItem.mockImplementation(async (key: string) => {
        if (key === '@auth:session') {
          const call = mockSetItem.mock.calls.find(([k]) => k === '@auth:session');
          return call ? call[1] : null;
        }
        return null;
      });

      const session = await authService.getSession();
      expect(session).not.toBeNull();
      expect(session?.accountId).toBe('demo-001');
    });
  });

  // ── clearSession ──────────────────────────────────────────────────────────

  describe('clearSession', () => {
    it('calls removeItem on the session key', async () => {
      setupEmptyStorage();
      await authService.clearSession();
      expect(mockRemoveItem).toHaveBeenCalledWith('@auth:session');
    });
  });

  // ── getSessionAccount ─────────────────────────────────────────────────────

  describe('getSessionAccount', () => {
    it('returns null when there is no session', async () => {
      mockGetItem.mockResolvedValue(null);
      mockSetItem.mockResolvedValue(undefined);
      const account = await authService.getSessionAccount();
      expect(account).toBeNull();
    });

    it('returns the full account for an active session', async () => {
      const session = { accountId: 'demo-001', createdAt: '2026-01-01T00:00:00.000Z' };
      mockGetItem.mockImplementation(async (key: string) => {
        if (key === '@auth:session') return JSON.stringify(session);
        if (key === '@auth:accounts') return null; // triggers seed load
        return null;
      });
      mockSetItem.mockResolvedValue(undefined);

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
      mockSetItem.mockResolvedValue(undefined);

      const account = await authService.getSessionAccount();
      expect(account).toBeNull();
    });
  });
});
