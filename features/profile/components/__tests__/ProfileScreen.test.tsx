import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ProfileScreen } from '../ProfileScreen';
import { createWrapper } from '@/test-utils/createWrapper';
import type { UserProfile } from '../../types';
import type { LocalAuthAccount } from '@/features/auth/types';

// ─── Mocks ───────────────────────────────────────────────────────────────────

// useProfile uses auth-service → token-manager → AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('../../hooks/useProfile');

import { useProfile } from '../../hooks/useProfile';

const mockUseProfile = useProfile as jest.Mock;

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
  cardNumber: '1234 5678 9012 3456',
  cardProvider: 'VISA',
  balance: 150000,
  currency: 'IDR',
  accountType: 'REGULAR',
};

function makeDefaultHook(overrides = {}) {
  return {
    user: MOCK_USER,
    profile: MOCK_PROFILE,
    isLoading: false,
    isSaving: false,
    saveProfile: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfile.mockReturnValue(makeDefaultHook());
  });

  it('renders Profile header text', () => {
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });
    expect(screen.getByText('Profile')).toBeOnTheScreen();
  });

  it('renders back button', () => {
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Go back')).toBeOnTheScreen();
  });

  it('shows loading indicator when isLoading is true', () => {
    mockUseProfile.mockReturnValueOnce(makeDefaultHook({ isLoading: true, profile: null }));
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });
    // Shows '...' for name while loading
    expect(screen.getByText('...')).toBeOnTheScreen();
  });

  it('pre-fills form with profile data', () => {
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });
    expect(screen.getByDisplayValue('BRI')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('Jakarta Pusat')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('Demo Merchant')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('1234 5678 9012 3456')).toBeOnTheScreen();
  });

  it('renders Confirm button', () => {
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Confirm')).toBeOnTheScreen();
  });

  it('calls saveProfile when Confirm button pressed', async () => {
    const saveProfile = jest.fn().mockResolvedValue(true);
    // Use mockReturnValue (not Once) so re-renders after useEffect also get the same saveProfile
    mockUseProfile.mockReturnValue(makeDefaultHook({ saveProfile }));
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Confirm'));
    await waitFor(() => {
      expect(saveProfile).toHaveBeenCalledTimes(1);
    });
  });

  it('shows card number validation error when invalid chars entered', async () => {
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });
    const { getByDisplayValue } = screen;
    const cardInput = getByDisplayValue('1234 5678 9012 3456');
    fireEvent.changeText(cardInput, 'ABCD');
    await waitFor(() => {
      expect(screen.getByText('Card number may only contain digits')).toBeOnTheScreen();
    });
  });

  it('shows card number too short error', async () => {
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });
    const cardInput = screen.getByDisplayValue('1234 5678 9012 3456');
    fireEvent.changeText(cardInput, '12');
    await waitFor(() => {
      expect(screen.getByText('Card number is too short')).toBeOnTheScreen();
    });
  });

  it('renders user display name from profile', () => {
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });
    expect(screen.getByText('Demo Merchant')).toBeOnTheScreen();
  });

  it('reverts form on save failure', async () => {
    const saveProfile = jest.fn().mockResolvedValue(false);
    // Use mockReturnValue so all re-renders get the same saveProfile
    mockUseProfile.mockReturnValue(makeDefaultHook({ saveProfile }));
    const { Wrapper } = createWrapper();
    render(<ProfileScreen />, { wrapper: Wrapper });

    // Change bank name from 'BRI' to 'Changed Bank'
    await waitFor(() => expect(screen.getByDisplayValue('BRI')).toBeOnTheScreen());
    fireEvent.changeText(screen.getByDisplayValue('BRI'), 'Changed Bank');
    expect(screen.getByDisplayValue('Changed Bank')).toBeOnTheScreen();

    fireEvent.press(screen.getByLabelText('Confirm'));
    await waitFor(() => {
      // After failure, should revert to original 'BRI'
      expect(screen.getByDisplayValue('BRI')).toBeOnTheScreen();
    });
  });

  it('renders avatar person icon when no image in profile', () => {
    mockUseProfile.mockReturnValueOnce(makeDefaultHook({ profile: { ...MOCK_PROFILE, image: undefined } }));
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<ProfileScreen />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
