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

  it('does not submit when username is filled but password is empty', async () => {
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    fireEvent.changeText(screen.getByLabelText('Username input'), 'user');
    // password left empty
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

  it('navigates to forgot-password when link is pressed', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({
      replace: mockReplace, back: mockBack, push: mockPush,
    });
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    fireEvent.press(screen.getByText('Forgot your password?'));
    expect(mockPush).toHaveBeenCalledWith('/forgot-password');
  });

  it('navigates to sign-up when sign-up link is pressed', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({
      replace: mockReplace, back: mockBack, push: mockPush,
    });
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Sign up'));
    expect(mockPush).toHaveBeenCalledWith('/sign-up');
  });

  it('calls biometric handler without error when biometric button is pressed', () => {
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    expect(() =>
      fireEvent.press(screen.getByLabelText('Login with biometric'))
    ).not.toThrow();
  });

  it('shows Profile Not Found alert and clears session on 404 ApiError from getProfile', async () => {
    const { ApiError } = require('@/core/api/errors');
    mockGetProfile.mockRejectedValueOnce(Object.assign(new ApiError('not_found', 'Not found', false, 404), { status: 404 }));
    const alertMock = jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(jest.fn());
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });

    fireEvent.changeText(screen.getByLabelText('Username input'), 'user');
    fireEvent.changeText(screen.getByLabelText('Password input'), 'pass');
    fireEvent.press(screen.getByLabelText('Sign in'));

    await waitFor(() => {
      expect(mockClearSession).toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith('Profile Not Found', expect.any(String));
    });
    alertMock.mockRestore();
  });

  it('clears session and shows generic alert when session is null after signIn', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const alertMock = jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(jest.fn());
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });

    fireEvent.changeText(screen.getByLabelText('Username input'), 'user');
    fireEvent.changeText(screen.getByLabelText('Password input'), 'pass');
    fireEvent.press(screen.getByLabelText('Sign in'));

    await waitFor(() => {
      expect(mockClearSession).toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith('Failed', expect.any(String));
    });
    alertMock.mockRestore();
  });

  it('does not submit a second time when already loading (isLoading guard)', async () => {
    // First press triggers load; second press while loading should be ignored
    let signInResolve!: () => void;
    mockSignIn.mockImplementationOnce(
      () => new Promise<void>((res) => { signInResolve = res; })
    );
    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });

    fireEvent.changeText(screen.getByLabelText('Username input'), 'user');
    fireEvent.changeText(screen.getByLabelText('Password input'), 'pass');

    fireEvent.press(screen.getByLabelText('Sign in')); // first press → isLoading = true
    fireEvent.press(screen.getByLabelText('Sign in')); // second press → early return (isLoading)

    // signIn called exactly once despite two presses
    expect(mockSignIn).toHaveBeenCalledTimes(1);
    signInResolve(); // clean up hanging promise
  });

  it('renders with android platform styles (covers Platform.OS !== ios branches)', () => {
    const Platform = require('react-native').Platform;
    const prevOS = Platform.OS;
    Platform.OS = 'android';

    const { Wrapper } = createWrapper();
    render(<SignInScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Sign in')).toBeOnTheScreen();

    Platform.OS = prevOS;
  });
});
