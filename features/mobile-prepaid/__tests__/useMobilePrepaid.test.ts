// features/mobile-prepaid/__tests__/useMobilePrepaid.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useMobilePrepaid } from '../hooks/useMobilePrepaid';
import { createWrapper } from '@/test-utils/createWrapper';
import { AMOUNT_OPTIONS } from '../types';
import type { PaymentCard } from '@/features/dashboard/types';
import { dashboardService } from '@/features/dashboard/services/dashboard-service';

jest.spyOn(Alert, 'alert');

jest.mock('@/features/dashboard/services/dashboard-service', () => ({
  dashboardService: {
    loadCards: jest.fn(),
  },
}));

const MOCK_CARDS: PaymentCard[] = [
  {
    id: 'card-001',
    accountId: 'demo-002',
    holderName: 'John Doe',
    cardLabel: 'VISA Platinum',
    maskedNumber: '4111  ••••  ••••  1234',
    balance: 1000000,
    currency: 'USD',
    brand: 'VISA',
    gradientColors: ['#1A1563', '#1E2FA0', '#3B7ED4'],
  },
];

describe('useMobilePrepaid', () => {
  const { Wrapper } = createWrapper();

  beforeEach(() => {
    (Alert.alert as jest.Mock).mockClear();
    (dashboardService.loadCards as jest.Mock).mockResolvedValue(MOCK_CARDS);
  });

  it('loads cards and beneficiaries on mount', async () => {
    const { result } = renderHook(() => useMobilePrepaid('demo-002'), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cards).toHaveLength(1);
    expect(result.current.beneficiaries.length).toBeGreaterThan(0);
  });

  it('selectBeneficiary fills phone field', async () => {
    const { result } = renderHook(() => useMobilePrepaid('demo-002'), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.selectBeneficiary(result.current.beneficiaries[0]);
    });

    expect(result.current.phone).toBe(result.current.beneficiaries[0].phone);
  });

  it('submit succeeds with valid data', async () => {
    const { result } = renderHook(() => useMobilePrepaid('demo-002'), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSelectedCard(result.current.cards[0]);
      result.current.setPhone('+8564757899');
      result.current.setSelectedAmount(AMOUNT_OPTIONS[0]);
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.isSuccess).toBe(true);
  });

  it('submit shows alert on failure', async () => {
    const { result } = renderHook(() => useMobilePrepaid('demo-002'), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSelectedCard(result.current.cards[0]);
      result.current.setPhone('+0000000000');
      result.current.setSelectedAmount(AMOUNT_OPTIONS[0]);
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith('Failed', 'Invalid phone number');
  });
});
