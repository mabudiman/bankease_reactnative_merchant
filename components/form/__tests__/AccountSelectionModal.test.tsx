import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createWrapper } from '@/test-utils/createWrapper';
import { AccountSelectionModal } from '@/components/form/account-selection-modal';
import { MOCK_WITHDRAW_ACCOUNTS } from '@/mocks/data';

const BASE_PROPS = {
  visible: true,
  accounts: MOCK_WITHDRAW_ACCOUNTS,
  onSelect: jest.fn(),
  onClose: jest.fn(),
};

describe('AccountSelectionModal — hidden', () => {
  it('does not render modal content when visible=false', () => {
    const { Wrapper } = createWrapper();
    render(
      <AccountSelectionModal {...BASE_PROPS} visible={false} />,
      { wrapper: Wrapper }
    );
    expect(screen.queryByText('Choose account:')).toBeNull();
  });
});

describe('AccountSelectionModal — visible', () => {
  it('renders the "Choose account:" title', () => {
    const { Wrapper } = createWrapper();
    render(<AccountSelectionModal {...BASE_PROPS} />, { wrapper: Wrapper });
    expect(screen.getByText('Choose account:')).toBeOnTheScreen();
  });

  it('renders all account labels from mock data', () => {
    const { Wrapper } = createWrapper();
    render(<AccountSelectionModal {...BASE_PROPS} />, { wrapper: Wrapper });
    MOCK_WITHDRAW_ACCOUNTS.forEach((account) => {
      expect(screen.getByText(account.label)).toBeOnTheScreen();
    });
  });

  it('shows checkmark icon for the selected account', () => {
    const selectedAccount = MOCK_WITHDRAW_ACCOUNTS[2]; // 4411 0000 1234
    const { Wrapper } = createWrapper();
    render(
      <AccountSelectionModal {...BASE_PROPS} selectedId={selectedAccount.id} />,
      { wrapper: Wrapper }
    );
    // Selected item has accessibilityState selected=true
    expect(screen.getByLabelText(selectedAccount.label)).toBeSelected();
  });

  it('unselected accounts are not marked as selected', () => {
    const { Wrapper } = createWrapper();
    render(
      <AccountSelectionModal {...BASE_PROPS} selectedId={MOCK_WITHDRAW_ACCOUNTS[0].id} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByLabelText(MOCK_WITHDRAW_ACCOUNTS[1].label)).not.toBeSelected();
  });

  it('calls onSelect with the correct account when an item is pressed', () => {
    const onSelect = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <AccountSelectionModal {...BASE_PROPS} onSelect={onSelect} />,
      { wrapper: Wrapper }
    );
    fireEvent.press(screen.getByLabelText(MOCK_WITHDRAW_ACCOUNTS[1].label));
    expect(onSelect).toHaveBeenCalledWith(MOCK_WITHDRAW_ACCOUNTS[1]);
  });

  it('calls onClose when the close button is pressed', () => {
    const onClose = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <AccountSelectionModal {...BASE_PROPS} onClose={onClose} />,
      { wrapper: Wrapper }
    );
    fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders without error when no selectedId is provided', () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<AccountSelectionModal {...BASE_PROPS} />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
