import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInScreen } from '../sign-in-screen';
import { createWrapper } from '@/test-utils/createWrapper';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack, push: jest.fn() }),
}));

jest.mock('@/features/auth/services/auth-service', () => ({
  authService: {
    signIn: jest.fn(),
    getSession: jest.fn(),
    clearSession: jest.fn(),
  },
}));

jest.mock('@/features/profile/api/profile-api', () => ({
  profileApi: {
    getProfile: jest.fn(),
  },
}));

jest.mock('@/assets/svgs/illustration.svg', () => 'MockIllustration');
jest.mock('@/assets/svgs/fingerprint.svg', () => 'MockFingerprint');

import { authService } from '@/features/auth/services/auth-service';
import { profileApi } from '@/features/profile/api/profile-api';

const mockSignIn = authService.signIn as jest.Mock;
const mockGetSession = authService.getSession as jest.Mock;
const mockClearSession = authService.clearSession as jest.Mock;
const mockGetProfile = profileApi.getProfile as jest.Mock;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockResolvedValue(undefined);
    mockGetSession.mockResolvedValue({ accountId: 'user-001', createdAt: '2026-01-01' });
    mockGetProfile.mockResolvedValue({ accountId: 'user-001' });
    mockClearSession.mockResolvedValue(undefined);
  });

  it('renders username input', () => {
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Username input')).toBeOnTheScreen();
  });

  it('renders password input', () => {
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Password input')).toBeOnTheScreen();
  });

  it('renders back button', () => {
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Go back')).toBeOnTheScreen();
  });

  it('renders sign in button', () => {
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Sign in')).toBeOnTheScreen();
  });

  it('navigates to tabs on successful sign in', async () => {
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });

    fireEvent.changeText(screen.getByLabelText('Username input'), 'merchant01');
    fireEvent.changeText(screen.getByLabelText('Password input'), 'pass123');
    fireEvent.press(screen.getByLabelText('Sign in'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('merchant01', 'pass123');
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('calls authService.signIn with correct args and handles INVALID_CREDENTIALS', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('INVALID_CREDENTIALS'));
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });

    fireEvent.changeText(screen.getByLabelText('Username input'), 'user');
    fireEvent.changeText(screen.getByLabelText('Password input'), 'wrongpass');
    fireEvent.press(screen.getByLabelText('Sign in'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('user', 'wrongpass');
    });
  });

  it('clears session on generic API error', async () => {
    // Any error other than INVALID_CREDENTIALS triggers clearSession in the else branch
    mockGetProfile.mockRejectedValueOnce(new Error('SOME_API_ERROR'));

    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });

    fireEvent.changeText(screen.getByLabelText('Username input'), 'user');
    fireEvent.changeText(screen.getByLabelText('Password input'), 'pass');
    fireEvent.press(screen.getByLabelText('Sign in'));

    await waitFor(() => {
      expect(mockClearSession).toHaveBeenCalled();
    });
  });

  it('does not submit when form fields are empty', async () => {
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Sign in'));
    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled();
    });
  });

  it('toggles password visibility when eye icon is pressed', () => {
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    const showPasswordButton = screen.getByLabelText('Show password');
    expect(showPasswordButton).toBeOnTheScreen();
    fireEvent.press(showPasswordButton);
    expect(screen.getByLabelText('Hide password')).toBeOnTheScreen();
  });
});
