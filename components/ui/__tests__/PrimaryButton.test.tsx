import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createWrapper } from '@/test-utils/createWrapper';
import { PrimaryButton } from '@/components/ui/primary-button';

describe('PrimaryButton', () => {
  it('renders the title text', () => {
    const { Wrapper } = createWrapper();
    render(<PrimaryButton title="Verify" />, { wrapper: Wrapper });
    expect(screen.getByText('Verify')).toBeOnTheScreen();
  });

  it('has accessibilityRole button', () => {
    const { Wrapper } = createWrapper();
    render(<PrimaryButton title="Verify" />, { wrapper: Wrapper });
    expect(screen.getByRole('button')).toBeOnTheScreen();
  });

  it('has accessibilityLabel matching the title', () => {
    const { Wrapper } = createWrapper();
    render(<PrimaryButton title="Verify" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Verify')).toBeOnTheScreen();
  });

  it('calls onPress when pressed and enabled', () => {
    const onPress = jest.fn();
    const { Wrapper } = createWrapper();
    render(<PrimaryButton title="Verify" onPress={onPress} />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onPress when disabled', () => {
    const onPress = jest.fn();
    const { Wrapper } = createWrapper();
    render(<PrimaryButton title="Verify" onPress={onPress} disabled />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does NOT call onPress when loading', () => {
    const onPress = jest.fn();
    const { Wrapper } = createWrapper();
    render(<PrimaryButton title="Verify" onPress={onPress} loading />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows ActivityIndicator when loading=true', () => {
    const { Wrapper } = createWrapper();
    render(<PrimaryButton title="Verify" loading />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Loading')).toBeOnTheScreen();
  });

  it('hides title text when loading=true', () => {
    const { Wrapper } = createWrapper();
    render(<PrimaryButton title="Verify" loading />, { wrapper: Wrapper });
    expect(screen.queryByText('Verify')).toBeNull();
  });

  it('has accessibilityState disabled=true when disabled', () => {
    const { Wrapper } = createWrapper();
    render(<PrimaryButton title="Verify" disabled />, { wrapper: Wrapper });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders without onPress prop without throwing', () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<PrimaryButton title="Verify" />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
