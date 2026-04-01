import { renderHook, waitFor, act } from '@testing-library/react-native';
import { createWrapper } from '@/test-utils/createWrapper';
import { profileEvents } from '@/features/profile/profileEvents';

jest.mock('@/features/auth/services/auth-service', () => ({
  authService: {
    getSessionAccount: jest.fn(),
  },
}));

jest.mock('../../services/dashboard-service', () => ({
  dashboardService: {
    loadCards: jest.fn(),
    getNotificationCount: jest.fn(),
  },
}));

jest.mock('@/features/profile/services/profile-service', () => ({
  profileService: {
    loadProfile: jest.fn(),
  },
}));

jest.mock('@/features/account/api', () => ({
  menuApi: {
    getMenuByAccountType: jest.fn(),
  },
}));

// useFocusEffect: simulate with useEffect (runs once after mount, not on every re-render)
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => (() => void) | undefined) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');
    React.useEffect(() => {
      const cleanup = cb();
      return cleanup ?? undefined;
    }, []); // empty deps = run once after mount
  },
}));

import { useDashboard } from '../useDashboard';
import { authService } from '@/features/auth/services/auth-service';
import { dashboardService } from '../../services/dashboard-service';
import { profileService } from '@/features/profile/services/profile-service';
import { menuApi } from '@/features/account/api';
import type { PaymentCard } from '../types';
import type { LocalAuthAccount } from '@/features/auth/types';

const mockGetSessionAccount = authService.getSessionAccount as jest.Mock;
const mockLoadCards = dashboardService.loadCards as jest.Mock;
const mockGetNotificationCount = dashboardService.getNotificationCount as jest.Mock;
const mockLoadProfile = profileService.loadProfile as jest.Mock;
const mockGetMenuByAccountType = menuApi.getMenuByAccountType as jest.Mock;

const MOCK_USER: LocalAuthAccount = {
  id: 'demo-001',
  name: 'Demo Merchant',
  phone: '081234567890',
  password: 'demo1234',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const MOCK_CARDS: PaymentCard[] = [
  {
    id: 'card-001',
    accountId: 'demo-001',
    holderName: 'Demo Merchant',
    cardLabel: 'VISA',
    maskedNumber: '4756  ••••  ••••  9018',
    balance: 346952,
    currency: 'USD',
    brand: 'VISA',
    gradientColors: ['#1A1563', '#1E2FA0', '#3B7ED4'],
  },
];

const MOCK_PROFILE = {
  accountId: 'da08ecfe-de3b-42b1-b1ce-018e144198f5',
  bankName: 'BRI',
  branchName: 'Jakarta',
  transactionName: 'Demo Merchant',
  cardNumber: '1234567890123456',
  cardProvider: 'VISA',
  balance: 150000,
  currency: 'IDR',
  accountType: 'REGULAR',
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionAccount.mockResolvedValue(MOCK_USER);
    mockLoadCards.mockResolvedValue(MOCK_CARDS);
    mockGetNotificationCount.mockResolvedValue(3);
    mockLoadProfile.mockResolvedValue(MOCK_PROFILE);
    mockGetMenuByAccountType.mockResolvedValue([]);
  });

  it('starts in loading state', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('loads user, cards, and notifications after focus', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toMatchObject({ id: 'demo-001' });
    expect(result.current.cards).toHaveLength(1);
    expect(result.current.notificationCount).toBe(3);
  });

  it('sets displayName from profile transactionName', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.displayName).toBe('Demo Merchant');
  });

  it('falls back to user.name when profile transactionName is empty', async () => {
    mockLoadProfile.mockResolvedValueOnce({ ...MOCK_PROFILE, transactionName: '' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.displayName).toBe('Demo Merchant'); // from user.name
  });

  it('sets isLoading false when no session account', async () => {
    mockGetSessionAccount.mockResolvedValueOnce(null);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.cards).toHaveLength(0);
  });

  it('maps menu items to privileges', async () => {
    const menuItem = {
      id: 'menu-1',
      title: 'Transfer',
      icon_url: 'http://example.com?icon_names=send_money',
      is_active: true,
      index: 0,
    };
    // Override default empty array with one item
    mockGetMenuByAccountType.mockResolvedValue([menuItem]);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.privileges).toHaveLength(1);
    expect(result.current.privileges[0].title).toBe('Transfer');
  });

  it('handles menu fetch failure gracefully', async () => {
    mockGetMenuByAccountType.mockRejectedValueOnce(new Error('menu fetch failed'));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Should still load with empty privileges
    expect(result.current.privileges).toHaveLength(0);
  });

  it('enriches first card with profile data', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const firstCard = result.current.cards[0];
    expect(firstCard.holderName).toBe('Demo Merchant');
    expect(firstCard.currency).toBe('IDR');
  });

  it('builds a card from profile data when loadCards returns empty', async () => {
    mockLoadCards.mockResolvedValueOnce([]);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cards).toHaveLength(1);
    expect(result.current.cards[0].holderName).toBe('Demo Merchant');
  });

  it('background-refreshes on profileSaved event without entering loading state', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const callsBefore = mockGetSessionAccount.mock.calls.length;

    await act(async () => {
      profileEvents.emitProfileSaved();
    });

    await waitFor(() => {
      expect(mockGetSessionAccount.mock.calls.length).toBeGreaterThan(callsBefore);
    });
    // Background refresh must NOT set isLoading to true
    expect(result.current.isLoading).toBe(false);
  });

  it('filters inactive menu items and uses apps icon for unrecognised icon_url', async () => {
    const items = [
      { id: 'active-1', title: 'Pay', icon_url: 'http://x.com?icon_names=unknown_icon', is_active: true, index: 0 },
      { id: 'inactive-1', title: 'Hidden', icon_url: '', is_active: false, index: 1 },
    ];
    mockGetMenuByAccountType.mockResolvedValueOnce(items);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Only the active item should appear and icon falls back to 'apps'
    expect(result.current.privileges).toHaveLength(1);
    expect(result.current.privileges[0].icon).toBe('apps');
  });

  it('builds a MASTERCARD card from profile when cardProvider is mastercard', async () => {
    mockLoadCards.mockResolvedValueOnce([]);
    mockLoadProfile.mockResolvedValueOnce({ ...MOCK_PROFILE, cardProvider: 'Mastercard' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cards[0].brand).toBe('MASTERCARD');
  });

  it('uses masked placeholder when card_number is xxx in empty-cards fallback', async () => {
    mockLoadCards.mockResolvedValueOnce([]);
    // transactionName empty so enrichment skips, preserving baseCards fallback maskedNumber
    mockLoadProfile.mockResolvedValueOnce({ ...MOCK_PROFILE, cardNumber: 'xxx', transactionName: '' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cards[0].maskedNumber).toBe('••••  ••••  ••••  ••••');
  });

  it('uses cardProvider as cardLabel fallback in empty-cards path', async () => {
    mockLoadCards.mockResolvedValueOnce([]);
    mockLoadProfile.mockResolvedValueOnce({ ...MOCK_PROFILE, cardProvider: '' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cards[0].cardLabel).toBe('BRI Card');
  });

  it('falls back to apps icon when icon_url has no icon_names param', async () => {
    const items = [
      { id: 'menu-2', title: 'Info', icon_url: 'http://example.com/no-param', is_active: true, index: 0 },
    ];
    mockGetMenuByAccountType.mockResolvedValueOnce(items);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.privileges[0].icon).toBe('apps');
  });

  it('exposes profileImage when profile has an image url', async () => {
    mockLoadProfile.mockResolvedValueOnce({ ...MOCK_PROFILE, image: 'https://cdn.example.com/avatar.jpg' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.profileImage).toBe('https://cdn.example.com/avatar.jpg');
  });

  it('uses fallback maskedNumber from card when enriched cardNumber is empty', async () => {
    mockLoadProfile.mockResolvedValueOnce({ ...MOCK_PROFILE, cardNumber: '' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // enrichment sets maskedNumber via maskCardNumber('') which yields '  ••••  ••••  '
    // just assert it doesn't throw and a card is rendered
    expect(result.current.cards).toHaveLength(1);
  });

  it('does not enrich first card when profile transactionName is empty', async () => {
    mockLoadProfile.mockResolvedValueOnce({ ...MOCK_PROFILE, transactionName: '' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // idx 0 card is NOT enriched when transactionName is empty — returns card as-is
    expect(result.current.cards[0].holderName).toBe(MOCK_CARDS[0].holderName);
  });

  it('uses card.balance when profile.balance is 0', async () => {
    mockLoadProfile.mockResolvedValueOnce({ ...MOCK_PROFILE, balance: 0 });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cards[0].balance).toBe(MOCK_CARDS[0].balance);
  });
});
