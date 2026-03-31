export interface MockAccount {
  readonly id: string;
  readonly label: string;
}

export type WithdrawFlowState = 'form' | 'success';

export const MOCK_ACCOUNTS: readonly MockAccount[] = [
  { id: '1', label: '1900 8988 5456' },
  { id: '2', label: '1900 8112 5222' },
  { id: '3', label: '4411 0000 1234' },
  { id: '4', label: '1900 8988 5457' },
  { id: '5', label: '1900 8988 5458' },
];

export const PRESET_AMOUNTS: readonly string[] = [
  '$10',
  '$50',
  '$100',
  '$150',
  '$200',
  'Other',
];

export const MOCK_ACCOUNT_BALANCE = '10,000$';
