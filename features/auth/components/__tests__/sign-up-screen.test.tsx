import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignUpScreen } from '../sign-up-screen';
import { createWrapper } from '@/test-utils/createWrapper';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush, replace: jest.fn() }),
}));

jest.mock('@/features/auth/services/auth-service', () => ({
  authService: {
    signUp: jest.fn(),
  },
}));

jest.mock('@/assets/svgs/sign-up-Illustration.svg', () => 'MockIllustration');

import { authService } from '@/features/auth/services/auth-service';
const mockSignUp = authService.signUp as jest.Mock;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignUp.mockResolvedValue(undefined);
  });

  it('renders back button', () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Go back')).toBeOnTheScreen();
  });

  it('back button calls router.back', () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Go back'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('renders name input', () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Name input')).toBeOnTheScreen();
  });

  it('renders phone input', () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Phone number input')).toBeOnTheScreen();
  });

  it('renders password input', () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Password input')).toBeOnTheScreen();
  });

  it('renders Sign Up button', () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Sign up')).toBeOnTheScreen();
  });

  it('shows name validation error when space entered', async () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    fireEvent.changeText(screen.getByLabelText('Name input'), 'user name');
    await waitFor(() => {
      expect(screen.getByText('Username must not contain spaces')).toBeOnTheScreen();
    });
  });

  it('shows phone validation error when invalid chars entered', async () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    fireEvent.changeText(screen.getByLabelText('Phone number input'), 'abc123');
    await waitFor(() => {
      expect(screen.getByText('Phone number may only contain digits (and a leading +)')).toBeOnTheScreen();
    });
  });

  it('shows password validation error when length < 6', async () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    fireEvent.changeText(screen.getByLabelText('Password input'), 'abc');
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeOnTheScreen();
    });
  });

  it('does not submit when form is invalid', async () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Sign up'));
    await waitFor(() => {
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  it('agreement checkbox is pressable', () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeOnTheScreen();
    fireEvent.press(checkbox);
    expect(checkbox).toBeOnTheScreen();
  });

  it('shows PHONE_TAKEN error from service', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('PHONE_TAKEN'));
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });

    fireEvent.changeText(screen.getByLabelText('Name input'), 'alice');
    fireEvent.changeText(screen.getByLabelText('Phone number input'), '082111222333');
    fireEvent.changeText(screen.getByLabelText('Password input'), 'password123');
    fireEvent.press(screen.getByRole('checkbox'));
    fireEvent.press(screen.getByLabelText('Sign up'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
    });
  });

  it('toggles password visibility', () => {
    const { Wrapper } = createWrapper();
    render(<SignUpScreen />, { wrapper: Wrapper });
    const showBtn = screen.getByLabelText('Show password');
    fireEvent.press(showBtn);
    expect(screen.getByLabelText('Hide password')).toBeOnTheScreen();
  });
});
