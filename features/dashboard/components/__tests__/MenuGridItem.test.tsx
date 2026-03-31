import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MenuGridItem } from '../MenuGridItem';
import { createWrapper } from '@/test-utils/createWrapper';
import type { Privilege } from '../../types';

const SAMPLE: Privilege = {
  code: 'payment',
  title: 'Payment',
  icon: 'card',
  color: '#3629B7',
  enabled: true,
};

describe('MenuGridItem', () => {
  it('renders the privilege title', () => {
    const { Wrapper } = createWrapper();
    render(<MenuGridItem privilege={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByText('Payment')).toBeOnTheScreen();
  });

  it('has accessibilityRole button', () => {
    const { Wrapper } = createWrapper();
    render(<MenuGridItem privilege={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByRole('button')).toBeOnTheScreen();
  });

  it('has accessibilityLabel matching title', () => {
    const { Wrapper } = createWrapper();
    render(<MenuGridItem privilege={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Payment')).toBeOnTheScreen();
  });

  it('shows Alert when pressed (Coming Soon)', () => {
    const alertMock = jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(jest.fn());
    const { Wrapper } = createWrapper();
    render(<MenuGridItem privilege={SAMPLE} />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(alertMock).toHaveBeenCalledTimes(1);
    alertMock.mockRestore();
  });

  it('renders different icons without error', () => {
    const { Wrapper } = createWrapper();
    const privilege: Privilege = { ...SAMPLE, icon: 'swap-horizontal', title: 'Transfer' };
    expect(() =>
      render(<MenuGridItem privilege={privilege} />, { wrapper: Wrapper })
    ).not.toThrow();
  });

  it('does not throw for any privilege code', () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<MenuGridItem privilege={{ ...SAMPLE, code: 'xyz', title: 'Unknown' }} />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
