import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createWrapper } from '@/test-utils/createWrapper';
import { ChooseAccountField } from '@/components/form/choose-account-field';

describe('ChooseAccountField', () => {
  it('renders placeholder when no value is provided', () => {
    const { Wrapper } = createWrapper();
    render(
      <ChooseAccountField placeholder="Choose account/ card" onPress={jest.fn()} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('Choose account/ card')).toBeOnTheScreen();
  });

  it('renders the value text when value is provided', () => {
    const { Wrapper } = createWrapper();
    render(
      <ChooseAccountField
        value="VISA **** **** **** 1234"
        placeholder="Choose account/ card"
        onPress={jest.fn()}
      />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('VISA **** **** **** 1234')).toBeOnTheScreen();
  });

  it('does not show placeholder when value is provided', () => {
    const { Wrapper } = createWrapper();
    render(
      <ChooseAccountField
        value="VISA **** **** **** 1234"
        placeholder="Choose account/ card"
        onPress={jest.fn()}
      />,
      { wrapper: Wrapper }
    );
    expect(screen.queryByText('Choose account/ card')).toBeNull();
  });

  it('has accessibilityRole button', () => {
    const { Wrapper } = createWrapper();
    render(
      <ChooseAccountField placeholder="Choose account/ card" onPress={jest.fn()} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByRole('button')).toBeOnTheScreen();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <ChooseAccountField placeholder="Choose account/ card" onPress={onPress} />,
      { wrapper: Wrapper }
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onPress when disabled', () => {
    const onPress = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <ChooseAccountField placeholder="Choose account/ card" onPress={onPress} disabled />,
      { wrapper: Wrapper }
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders without throwing when no value and no disabled', () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(
        <ChooseAccountField placeholder="Choose account/ card" onPress={jest.fn()} />,
        { wrapper: Wrapper }
      )
    ).not.toThrow();
  });
});
