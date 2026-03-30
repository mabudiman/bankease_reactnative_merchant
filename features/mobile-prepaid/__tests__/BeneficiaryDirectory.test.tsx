// features/mobile-prepaid/__tests__/BeneficiaryDirectory.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { BeneficiaryDirectory } from '../components/BeneficiaryDirectory';
import type { Beneficiary } from '../types';

jest.spyOn(Alert, 'alert');

const BENEFICIARIES: Beneficiary[] = [
  { id: 'ben-001', name: 'Emma', phone: '+8564757899' },
  { id: 'ben-002', name: 'Justin', phone: '+8123456789' },
];

describe('BeneficiaryDirectory', () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
    (Alert.alert as jest.Mock).mockClear();
  });

  it('renders beneficiary names', () => {
    const { getByText } = render(
      <BeneficiaryDirectory
        beneficiaries={BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
      />,
    );
    expect(getByText('Emma')).toBeTruthy();
    expect(getByText('Justin')).toBeTruthy();
  });

  it('calls onSelect when a beneficiary is tapped', () => {
    const { getByText } = render(
      <BeneficiaryDirectory
        beneficiaries={BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.press(getByText('Emma'));
    expect(onSelect).toHaveBeenCalledWith(BENEFICIARIES[0]);
  });

  it('shows Coming Soon alert when add button is pressed', () => {
    const { getByLabelText } = render(
      <BeneficiaryDirectory
        beneficiaries={BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.press(getByLabelText('Add beneficiary'));
    expect(Alert.alert).toHaveBeenCalledWith('Coming Soon');
  });

  it('shows Coming Soon alert when Find beneficiary is pressed', () => {
    const { getByText } = render(
      <BeneficiaryDirectory
        beneficiaries={BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.press(getByText('Find beneficiary'));
    expect(Alert.alert).toHaveBeenCalledWith('Coming Soon');
  });
});
