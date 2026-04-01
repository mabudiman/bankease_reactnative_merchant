import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AccountCardCarousel } from '../AccountCardCarousel';
import { createWrapper } from '@/test-utils/createWrapper';
import type { PaymentCard } from '../../types';

jest.mock('@/assets/svgs/icon_visa.svg', () => 'MockVisaLogo');

function makeCard(id: string, brand: PaymentCard['brand'] = 'VISA'): PaymentCard {
  return {
    id,
    accountId: 'demo-001',
    holderName: 'Test User',
    cardLabel: `Card ${id}`,
    maskedNumber: `1234  ••••  ••••  ${id.padStart(4, '0')}`,
    balance: 100000,
    currency: 'USD',
    brand,
    gradientColors: ['#1A1563', '#1E2FA0', '#3B7ED4'],
  };
}

describe('AccountCardCarousel', () => {
  it('renders single card without error', () => {
    const { Wrapper } = createWrapper();
    render(<AccountCardCarousel cards={[makeCard('1')]} />, { wrapper: Wrapper });
    // Component always renders 3 stacked layers; single card → front + 2 ghost copies
    const names = screen.getAllByText('Test User');
    expect(names.length).toBe(3);
  });

  it('renders two stacked cards', () => {
    const { Wrapper } = createWrapper();
    render(<AccountCardCarousel cards={[makeCard('1'), makeCard('2')]} />, { wrapper: Wrapper });
    // 3 layers: cards[0] (front) + cards[1] (middle) + ghost of cards[0] (back) → all 'Test User'
    const names = screen.getAllByText('Test User');
    expect(names.length).toBe(3);
  });

  it('renders three stacked cards (max layers)', () => {
    const { Wrapper } = createWrapper();
    render(
      <AccountCardCarousel cards={[makeCard('1'), makeCard('2'), makeCard('3')]} />,
      { wrapper: Wrapper }
    );
    const names = screen.getAllByText('Test User');
    expect(names.length).toBe(3);
  });

  it('only renders first 3 cards when more than 3 provided', () => {
    const { Wrapper } = createWrapper();
    render(
      <AccountCardCarousel
        cards={[makeCard('1'), makeCard('2'), makeCard('3'), makeCard('4')]}
      />,
      { wrapper: Wrapper }
    );
    // Only 3 layers shown
    const names = screen.getAllByText('Test User');
    expect(names.length).toBe(3);
  });

  it('renders MASTERCARD cards without error', () => {
    const { Wrapper } = createWrapper();
    render(
      <AccountCardCarousel cards={[makeCard('5', 'MASTERCARD')]} />,
      { wrapper: Wrapper }
    );
    // Single card → 3 layers (front + 2 ghost copies)
    expect(screen.getAllByText('Test User').length).toBe(3);
  });

  it('renders empty state without error when no cards', () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<AccountCardCarousel cards={[]} />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
