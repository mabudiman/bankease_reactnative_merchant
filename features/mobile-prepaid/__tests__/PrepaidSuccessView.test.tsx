// features/mobile-prepaid/__tests__/PrepaidSuccessView.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PrepaidSuccessView } from '../components/PrepaidSuccessView';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

describe('PrepaidSuccessView', () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it('renders success title and message', () => {
    const { getByText } = render(<PrepaidSuccessView />);
    expect(getByText('Payment success!')).toBeTruthy();
    expect(
      getByText('You have successfully paid mobile prepaid!'),
    ).toBeTruthy();
  });

  it('navigates to home when confirm is pressed', () => {
    const { getByText } = render(<PrepaidSuccessView />);
    fireEvent.press(getByText('Confirm'));
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });
});
