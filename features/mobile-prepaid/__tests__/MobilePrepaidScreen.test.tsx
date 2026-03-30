// features/mobile-prepaid/__tests__/MobilePrepaidScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { MobilePrepaidScreen } from '../components/MobilePrepaidScreen';
import { createWrapper } from '@/test-utils/createWrapper';
import type { PaymentCard } from '@/features/dashboard/types';

jest.spyOn(Alert, 'alert');

const mockBack = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
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

jest.mock('@/features/dashboard/services/dashboard-service', () => ({
  dashboardService: {
    loadCards: jest.fn(),
  },
}));

jest.mock('@/features/auth/services/auth-service', () => ({
  authService: {
    getSessionAccount: jest.fn(),
  },
}));

describe('MobilePrepaidScreen', () => {
  const { Wrapper } = createWrapper();

  beforeEach(() => {
    mockBack.mockClear();
    mockReplace.mockClear();
    (Alert.alert as jest.Mock).mockClear();
    const { dashboardService } = require('@/features/dashboard/services/dashboard-service');
    (dashboardService.loadCards as jest.Mock).mockResolvedValue(MOCK_CARDS);
    const { authService } = require('@/features/auth/services/auth-service');
    (authService.getSessionAccount as jest.Mock).mockResolvedValue({
      id: 'demo-002',
      name: 'Test User',
      phone: '1234567890',
      password: 'test',
      createdAt: '2026-01-01',
    });
  });

  it('renders the form after loading', async () => {
    const { getByText, getByLabelText } = render(
      <Wrapper>
        <MobilePrepaidScreen />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByText('Mobile prepaid')).toBeTruthy();
    });

    expect(getByText('Choose account / card')).toBeTruthy();
    expect(getByLabelText('Phone number')).toBeTruthy();
    expect(getByText('$10')).toBeTruthy();
    expect(getByText('$20')).toBeTruthy();
    expect(getByText('$30')).toBeTruthy();
  });

  it('confirm button is disabled when form is incomplete', async () => {
    const { getByLabelText } = render(
      <Wrapper>
        <MobilePrepaidScreen />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByLabelText('Confirm')).toBeTruthy();
    });

    const confirmButton = getByLabelText('Confirm');
    expect(confirmButton.props.accessibilityState?.disabled ?? confirmButton.props.disabled).toBeTruthy();
  });

  it('navigates back when back arrow is pressed', async () => {
    const { getByLabelText } = render(
      <Wrapper>
        <MobilePrepaidScreen />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByLabelText('Go back')).toBeTruthy();
    });

    fireEvent.press(getByLabelText('Go back'));
    expect(mockBack).toHaveBeenCalled();
  });
});
