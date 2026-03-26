import AsyncStorage from '@react-native-async-storage/async-storage';
import { dashboardService } from '../dashboard-service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

function setupEmptyStorage() {
  mockGetItem.mockResolvedValue(null);
  mockSetItem.mockResolvedValue(undefined);
}

function setupStorageWithCards(cards: object[]) {
  mockGetItem.mockImplementation(async (key: string) => {
    if (key === '@dashboard:cards') return JSON.stringify(cards);
    return null;
  });
  mockSetItem.mockResolvedValue(undefined);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('dashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── loadCards ─────────────────────────────────────────────────────────────

  describe('loadCards', () => {
    it('returns 2 seeded cards for demo-001 on first load (null storage)', async () => {
      setupEmptyStorage();
      const cards = await dashboardService.loadCards('demo-001');
      expect(cards).toHaveLength(2);
      expect(cards.every((c) => c.accountId === 'demo-001')).toBe(true);
    });

    it('returns 2 seeded cards for demo-002 on first load (null storage)', async () => {
      setupEmptyStorage();
      const cards = await dashboardService.loadCards('demo-002');
      expect(cards).toHaveLength(2);
      expect(cards.every((c) => c.accountId === 'demo-002')).toBe(true);
      const brands = cards.map((c) => c.brand);
      expect(brands).toContain('VISA');
      expect(brands).toContain('MASTERCARD');
    });

    it('returns empty array for unknown accountId', async () => {
      setupEmptyStorage();
      const cards = await dashboardService.loadCards('unknown-user-xyz');
      expect(cards).toHaveLength(0);
    });

    it('seeds cards automatically when storage is null', async () => {
      setupEmptyStorage();
      await dashboardService.loadCards('demo-001');
      expect(mockSetItem).toHaveBeenCalledWith(
        '@dashboard:cards',
        expect.any(String),
      );
    });

    it('does not duplicate cards on subsequent calls', async () => {
      setupEmptyStorage();
      // First call seeds storage
      const firstCards = await dashboardService.loadCards('demo-001');
      // Mock storage now has the seeded cards
      setupStorageWithCards(
        firstCards.map((c) => ({ ...c, accountId: 'demo-001' })),
      );
      // Second call should not add duplicates
      const setCallsBefore = mockSetItem.mock.calls.length;
      await dashboardService.loadCards('demo-001');
      // setItem should not be called again (no change)
      expect(mockSetItem.mock.calls.length).toBe(setCallsBefore);
    });

    it('returns only cards for the requested accountId', async () => {
      // Storage already has ALL seed cards for both accounts (simulates a fully-seeded state)
      const mixedCards = [
        {
          id: 'card-001-1', accountId: 'demo-001', holderName: 'John Smith', cardLabel: 'Amazon Platinium',
          maskedNumber: '4756  •••• •••• 9018', balance: 346952, currency: 'USD', brand: 'VISA',
          gradientColors: ['#1A1563', '#1E2FA0', '#3B7ED4'],
        },
        {
          id: 'card-001-2', accountId: 'demo-001', holderName: 'John Smith', cardLabel: 'Gold Card',
          maskedNumber: '5281  •••• •••• 4471', balance: 123400, currency: 'USD', brand: 'MASTERCARD',
          gradientColors: ['#2D1B69', '#5B2D8E', '#8E4EC6'],
        },
        {
          id: 'card-002-1', accountId: 'demo-002', holderName: 'Premium Merchant', cardLabel: 'Platinum Business',
          maskedNumber: '4539  •••• •••• 8812', balance: 987650, currency: 'USD', brand: 'VISA',
          gradientColors: ['#0A3D2B', '#1A6B3C', '#27AE60'],
        },
        {
          id: 'card-002-2', accountId: 'demo-002', holderName: 'Premium Merchant', cardLabel: 'Corporate Black',
          maskedNumber: '5567  •••• •••• 3301', balance: 524000, currency: 'USD', brand: 'MASTERCARD',
          gradientColors: ['#0D0821', '#1A0A3D', '#3D1A8F'],
        },
      ];
      setupStorageWithCards(mixedCards);
      const cards = await dashboardService.loadCards('demo-001');
      expect(cards).toHaveLength(2);
      expect(cards.every((c) => c.accountId === 'demo-001')).toBe(true);
    });
  });

  // ── getPrivileges ─────────────────────────────────────────────────────────

  describe('getPrivileges', () => {
    it('returns exactly 3 enabled privileges for demo-001 (basic)', () => {
      const privileges = dashboardService.getPrivileges('demo-001');
      const enabled = privileges.filter((p) => p.enabled);
      const disabled = privileges.filter((p) => !p.enabled);

      expect(privileges).toHaveLength(9);
      expect(enabled).toHaveLength(3);
      expect(disabled).toHaveLength(6);

      const enabledCodes = enabled.map((p) => p.code);
      expect(enabledCodes).toContain('ACCOUNT_CARD');
      expect(enabledCodes).toContain('TRANSFER');
      expect(enabledCodes).toContain('TRANSACTION_REPORT');
    });

    it('returns all 9 enabled privileges for demo-002 (premium)', () => {
      const privileges = dashboardService.getPrivileges('demo-002');
      expect(privileges).toHaveLength(9);
      expect(privileges.every((p) => p.enabled)).toBe(true);
    });

    it('returns only ACCOUNT_CARD enabled for a new (unknown) accountId', () => {
      const privileges = dashboardService.getPrivileges('new-user-brand-new');
      const enabled = privileges.filter((p) => p.enabled);

      expect(privileges).toHaveLength(9);
      expect(enabled).toHaveLength(1);
      expect(enabled[0].code).toBe('ACCOUNT_CARD');
    });

    it('every privilege has required fields (code, title, icon, color, enabled)', () => {
      const privileges = dashboardService.getPrivileges('demo-001');
      for (const p of privileges) {
        expect(p.code).toBeTruthy();
        expect(p.title).toBeTruthy();
        expect(p.icon).toBeTruthy();
        expect(p.color).toBeTruthy();
        expect(typeof p.enabled).toBe('boolean');
      }
    });
  });

  // ── getNotificationCount ──────────────────────────────────────────────────

  describe('getNotificationCount', () => {
    it('returns 3 as default when no stored value', async () => {
      setupEmptyStorage();
      const count = await dashboardService.getNotificationCount('demo-001');
      expect(count).toBe(3);
    });

    it('stores 3 when called for the first time', async () => {
      setupEmptyStorage();
      await dashboardService.getNotificationCount('demo-001');
      expect(mockSetItem).toHaveBeenCalledWith(
        '@dashboard:notifications:demo-001',
        JSON.stringify(3),
      );
    });

    it('returns stored value when it exists', async () => {
      mockGetItem.mockImplementation(async (key: string) => {
        if (key === '@dashboard:notifications:demo-001') return JSON.stringify(7);
        return null;
      });
      mockSetItem.mockResolvedValue(undefined);

      const count = await dashboardService.getNotificationCount('demo-001');
      expect(count).toBe(7);
    });

    it('returns 0 when stored value is 0', async () => {
      mockGetItem.mockImplementation(async (key: string) => {
        if (key === '@dashboard:notifications:demo-002') return JSON.stringify(0);
        return null;
      });
      mockSetItem.mockResolvedValue(undefined);

      const count = await dashboardService.getNotificationCount('demo-002');
      expect(count).toBe(0);
    });

    it('uses a per-account key', async () => {
      setupEmptyStorage();
      await dashboardService.getNotificationCount('account-abc');
      expect(mockGetItem).toHaveBeenCalledWith(
        '@dashboard:notifications:account-abc',
      );
    });
  });
});
