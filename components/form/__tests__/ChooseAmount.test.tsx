import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createWrapper } from '@/test-utils/createWrapper';
import { ChooseAmount } from '@/components/form/choose-amount';
import { PRESET_AMOUNTS } from '@/features/withdraw/types';

const DEFAULT_PROPS = {
  presetAmounts: PRESET_AMOUNTS,
  selectedAmount: null,
  onSelectAmount: jest.fn(),
  allowCustomAmount: true,
  customAmount: '',
  onChangeCustomAmount: jest.fn(),
};

describe('ChooseAmount — grid mode', () => {
  it('renders all preset labels', () => {
    const { Wrapper } = createWrapper();
    render(<ChooseAmount {...DEFAULT_PROPS} />, { wrapper: Wrapper });
    PRESET_AMOUNTS.forEach((label) => {
      expect(screen.getByText(label)).toBeOnTheScreen();
    });
  });

  it('renders all preset items as buttons', () => {
    const { Wrapper } = createWrapper();
    render(<ChooseAmount {...DEFAULT_PROPS} />, { wrapper: Wrapper });
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(PRESET_AMOUNTS.length);
  });

  it('calls onSelectAmount with the correct label when a preset is pressed', () => {
    const onSelectAmount = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <ChooseAmount {...DEFAULT_PROPS} onSelectAmount={onSelectAmount} />,
      { wrapper: Wrapper }
    );
    fireEvent.press(screen.getByLabelText('$100'));
    expect(onSelectAmount).toHaveBeenCalledWith('$100');
  });

  it('marks selected preset with accessibilityState selected=true', () => {
    const { Wrapper } = createWrapper();
    render(
      <ChooseAmount {...DEFAULT_PROPS} selectedAmount="$100" />,
      { wrapper: Wrapper }
    );
    expect(screen.getByLabelText('$100')).toBeSelected();
  });

  it('unselected presets have accessibilityState selected=false', () => {
    const { Wrapper } = createWrapper();
    render(
      <ChooseAmount {...DEFAULT_PROPS} selectedAmount="$100" />,
      { wrapper: Wrapper }
    );
    expect(screen.getByLabelText('$10')).not.toBeSelected();
  });

  it('calls onSelectAmount with "Other" when Other is pressed', () => {
    const onSelectAmount = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <ChooseAmount {...DEFAULT_PROPS} onSelectAmount={onSelectAmount} />,
      { wrapper: Wrapper }
    );
    fireEvent.press(screen.getByLabelText('Other'));
    expect(onSelectAmount).toHaveBeenCalledWith('Other');
  });
});

describe('ChooseAmount — custom mode (Other selected)', () => {
  const customProps = {
    ...DEFAULT_PROPS,
    selectedAmount: 'Other',
    allowCustomAmount: true,
  };

  it('hides the preset grid when Other is selected', () => {
    const { Wrapper } = createWrapper();
    render(<ChooseAmount {...customProps} />, { wrapper: Wrapper });
    expect(screen.queryByText('$10')).toBeNull();
  });

  it('shows TextInput with placeholder "Amount"', () => {
    const { Wrapper } = createWrapper();
    render(<ChooseAmount {...customProps} />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText('Amount')).toBeOnTheScreen();
  });

  it('displays formatted value "$ 1000" when customAmount is "1000"', () => {
    const { Wrapper } = createWrapper();
    render(
      <ChooseAmount {...customProps} customAmount="1000" />,
      { wrapper: Wrapper }
    );
    expect(screen.getByDisplayValue('$ 1000')).toBeOnTheScreen();
  });

  it('calls onChangeCustomAmount with only digits when text is changed', () => {
    const onChangeCustomAmount = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <ChooseAmount {...customProps} onChangeCustomAmount={onChangeCustomAmount} />,
      { wrapper: Wrapper }
    );
    fireEvent.changeText(screen.getByPlaceholderText('Amount'), '$ 500');
    expect(onChangeCustomAmount).toHaveBeenCalledWith('500');
  });

  it('calls onChangeCustomAmount with empty string when cleared', () => {
    const onChangeCustomAmount = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <ChooseAmount {...customProps} onChangeCustomAmount={onChangeCustomAmount} />,
      { wrapper: Wrapper }
    );
    fireEvent.changeText(screen.getByPlaceholderText('Amount'), '');
    expect(onChangeCustomAmount).toHaveBeenCalledWith('');
  });
});
