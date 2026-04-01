import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { createWrapper } from '@/test-utils/createWrapper';
import { WithdrawScreen } from '@/features/withdraw/components/WithdrawScreen';
import { MOCK_WITHDRAW_ACCOUNTS } from '@/mocks/data';

jest.mock('@/assets/svgs/with-draw.svg', () => 'MockWithDrawIllustration');

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

function renderWithdraw() {
  const { Wrapper } = createWrapper();
  return render(<WithdrawScreen />, { wrapper: Wrapper });
}

async function fillFormWithPreset() {
  renderWithdraw();

  // Select account
  fireEvent.press(screen.getByLabelText('Choose account/ card'));
  fireEvent.press(screen.getByLabelText(MOCK_WITHDRAW_ACCOUNTS[2].label));
  await waitFor(() => expect(screen.queryByText('Choose account:')).toBeNull());

  // Fill phone
  fireEvent.changeText(screen.getByPlaceholderText('Phone number'), '+8564757899');

  // Select $100
  fireEvent.press(screen.getByLabelText('$100'));
}

async function selectOther() {
  renderWithdraw();
  // Select account
  fireEvent.press(screen.getByLabelText('Choose account/ card'));
  fireEvent.press(screen.getByLabelText(MOCK_WITHDRAW_ACCOUNTS[0].label));
  await waitFor(() => expect(screen.queryByText('Choose account:')).toBeNull());
  // Fill phone
  fireEvent.changeText(screen.getByPlaceholderText('Phone number'), '+8564757899');
  // Select Other
  fireEvent.press(screen.getByLabelText('Other'));
}

async function fillAndVerify() {
  renderWithdraw();
  // Select account
  fireEvent.press(screen.getByLabelText('Choose account/ card'));
  fireEvent.press(screen.getByLabelText(MOCK_WITHDRAW_ACCOUNTS[0].label));
  await waitFor(() => expect(screen.queryByText('Choose account:')).toBeNull());
  // Fill phone
  fireEvent.changeText(screen.getByPlaceholderText('Phone number'), '+8564757899');
  // Select amount
  fireEvent.press(screen.getByLabelText('$100'));
  // Press Verify
  await waitFor(() => expect(screen.getByLabelText('Verify')).not.toBeDisabled());
  fireEvent.press(screen.getByLabelText('Verify'));
}

describe('WithdrawScreen — initial state (Screen 1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "Withdraw" header title', () => {
    renderWithdraw();
    expect(screen.getByText('Withdraw')).toBeOnTheScreen();
  });

  it('renders the account field with placeholder', () => {
    renderWithdraw();
    expect(screen.getByText('Choose account/ card')).toBeOnTheScreen();
  });

  it('renders the phone number input', () => {
    renderWithdraw();
    expect(screen.getByPlaceholderText('Phone number')).toBeOnTheScreen();
  });

  it('renders the "Choose amount" label', () => {
    renderWithdraw();
    expect(screen.getByText('Choose amount')).toBeOnTheScreen();
  });

  it('renders all preset amount pills', () => {
    renderWithdraw();
    expect(screen.getByText('$10')).toBeOnTheScreen();
    expect(screen.getByText('$100')).toBeOnTheScreen();
    expect(screen.getByText('Other')).toBeOnTheScreen();
  });

  it('renders the Verify button', () => {
    renderWithdraw();
    expect(screen.getByText('Verify')).toBeOnTheScreen();
  });

  it('Verify button is disabled in initial state', () => {
    renderWithdraw();
    expect(screen.getByLabelText('Verify')).toBeDisabled();
  });

  it('does not show available balance before account is selected', () => {
    renderWithdraw();
    expect(screen.queryByText(/Available balance/)).toBeNull();
  });
});

describe('WithdrawScreen — account selection modal (Screen 3)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens modal when account field is pressed', () => {
    renderWithdraw();
    fireEvent.press(screen.getByLabelText('Choose account/ card'));
    expect(screen.getByText('Choose account:')).toBeOnTheScreen();
  });

  it('closes modal and shows masked account after selecting an account', async () => {
    renderWithdraw();
    fireEvent.press(screen.getByLabelText('Choose account/ card'));

    const targetAccount = MOCK_WITHDRAW_ACCOUNTS[2]; // 4411 0000 1234
    fireEvent.press(screen.getByLabelText(targetAccount.label));

    await waitFor(() => {
      expect(screen.queryByText('Choose account:')).toBeNull();
    });

    expect(screen.getByText('VISA **** **** **** 1234')).toBeOnTheScreen();
  });

  it('shows available balance after account is selected', async () => {
    renderWithdraw();
    fireEvent.press(screen.getByLabelText('Choose account/ card'));
    fireEvent.press(screen.getByLabelText(MOCK_WITHDRAW_ACCOUNTS[0].label));

    await waitFor(() => {
      expect(screen.getByText(/Available balance : 10,000\$/)).toBeOnTheScreen();
    });
  });
});

describe('WithdrawScreen — filled state with preset (Screen 2)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Verify button becomes enabled when all fields are filled', async () => {
    await fillFormWithPreset();
    await waitFor(() => {
      expect(screen.getByLabelText('Verify')).not.toBeDisabled();
    });
  });

  it('Verify button remains disabled with phone but no account or amount', () => {
    renderWithdraw();
    fireEvent.changeText(screen.getByPlaceholderText('Phone number'), '+8564757899');
    expect(screen.getByLabelText('Verify')).toBeDisabled();
  });
});

describe('WithdrawScreen — custom amount mode (Screen 4 & 5)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows Amount text input when Other is selected', async () => {
    await selectOther();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Amount')).toBeOnTheScreen();
    });
  });

  it('hides preset grid when Other is selected', async () => {
    await selectOther();
    await waitFor(() => {
      expect(screen.queryByText('$10')).toBeNull();
    });
  });

  it('Verify button is disabled when custom input is empty (Screen 4)', async () => {
    await selectOther();
    expect(screen.getByLabelText('Verify')).toBeDisabled();
  });

  it('Verify button becomes enabled when custom amount is entered (Screen 5)', async () => {
    await selectOther();
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Amount')).toBeOnTheScreen()
    );
    fireEvent.changeText(screen.getByPlaceholderText('Amount'), '$ 1000');
    await waitFor(() => {
      expect(screen.getByLabelText('Verify')).not.toBeDisabled();
    });
  });
});

describe('WithdrawScreen — success state (Screen 6)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows "Successful withdrawal!" after pressing Verify', async () => {
    await fillAndVerify();
    await waitFor(() => {
      expect(screen.getByText('Successful withdrawal!')).toBeOnTheScreen();
    });
  });

  it('shows the Confirm button on success screen', async () => {
    await fillAndVerify();
    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeOnTheScreen();
    });
  });

  it('calls router.back() when Confirm is pressed', async () => {
    await fillAndVerify();
    await waitFor(() => expect(screen.getByText('Confirm')).toBeOnTheScreen());
    fireEvent.press(screen.getByLabelText('Confirm'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('does not show form fields on success screen', async () => {
    await fillAndVerify();
    await waitFor(() => expect(screen.getByText('Successful withdrawal!')).toBeOnTheScreen());
    expect(screen.queryByPlaceholderText('Phone number')).toBeNull();
  });
});

describe('WithdrawScreen — back navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls router.back() when back arrow is pressed', () => {
    renderWithdraw();
    fireEvent.press(screen.getByLabelText('Go back'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
