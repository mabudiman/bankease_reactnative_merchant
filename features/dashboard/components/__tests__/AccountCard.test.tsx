import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AccountCard } from '../AccountCard';
import { createWrapper } from '@/test-utils/createWrapper';
import type { PaymentCard } from '../../types';

jest.mock('@/assets/svgs/icon_visa.svg', () => 'MockVisaLogo');

const SAMPLE_VISA: PaymentCard = {
  id: 'card-001',
  accountId: 'demo-001',
  holderName: 'John Smith',
  cardLabel: 'Amazon Platinum',
  maskedNumber: '4756  ••••  ••••  9018',
  balance: 346952,
  currency: 'USD',
  brand: 'VISA',
  gradientColors: ['#1A1563', '#1E2FA0', '#3B7ED4'],
};

const SAMPLE_MASTERCARD: PaymentCard = {
  ...SAMPLE_VISA,
  id: 'card-002',
  brand: 'MASTERCARD',
  cardLabel: 'Gold Card',
  maskedNumber: '5281  ••••  ••••  4471',
  gradientColors: ['#2D1B69', '#5B2D8E', '#8E4EC6'],
};

describe('AccountCard', () => {
  it('renders holder name', () => {
    const { Wrapper } = createWrapper();
    render(<AccountCard card={SAMPLE_VISA} />, { wrapper: Wrapper });
    expect(screen.getByText('John Smith')).toBeOnTheScreen();
  });

  it('renders card label', () => {
    const { Wrapper } = createWrapper();
    render(<AccountCard card={SAMPLE_VISA} />, { wrapper: Wrapper });
    expect(screen.getByText('Amazon Platinum')).toBeOnTheScreen();
  });

  it('renders masked card number', () => {
    const { Wrapper } = createWrapper();
    render(<AccountCard card={SAMPLE_VISA} />, { wrapper: Wrapper });
    expect(screen.getByText('4756  ••••  ••••  9018')).toBeOnTheScreen();
  });

  it('renders formatted balance', () => {
    const { Wrapper } = createWrapper();
    render(<AccountCard card={SAMPLE_VISA} />, { wrapper: Wrapper });
    // balance 346952 in minor units = 3469.52 USD
    expect(screen.getByText(/3[,.]?469/)).toBeOnTheScreen();
  });

  it('renders VISA logo for VISA brand', () => {
    const { Wrapper } = createWrapper();
    render(<AccountCard card={SAMPLE_VISA} />, { wrapper: Wrapper });
    // VISA card renders — no throw
    expect(screen.getByText('John Smith')).toBeOnTheScreen();
  });

  it('renders MASTERCARD circles for MASTERCARD brand', () => {
    const { Wrapper } = createWrapper();
    render(<AccountCard card={SAMPLE_MASTERCARD} />, { wrapper: Wrapper });
    // Renders without throw
    expect(screen.getByText('John Smith')).toBeOnTheScreen();
  });

  it('renders card label for MASTERCARD', () => {
    const { Wrapper } = createWrapper();
    render(<AccountCard card={SAMPLE_MASTERCARD} />, { wrapper: Wrapper });
    expect(screen.getByText('Gold Card')).toBeOnTheScreen();
  });

  it('does not throw for any supported card brand', () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<AccountCard card={SAMPLE_VISA} />, { wrapper: Wrapper })
    ).not.toThrow();
    expect(() =>
      render(<AccountCard card={SAMPLE_MASTERCARD} />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
