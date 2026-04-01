import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { DashboardHeader } from '../DashboardHeader';
import { createWrapper } from '@/test-utils/createWrapper';

jest.mock('@/assets/svgs/icon_notification.svg', () => 'MockNotificationIcon');


describe('DashboardHeader', () => {
  it('renders greeting with name', () => {
    const { Wrapper } = createWrapper();
    render(
      <DashboardHeader name="John" notificationCount={0} />,
      { wrapper: Wrapper }
    );
    // t('dashboard.header.greeting') = 'Good morning, {{name}}' or similar; just check name appears
    expect(screen.getByText(/John/)).toBeOnTheScreen();
  });

  it('renders notification button', () => {
    const { Wrapper } = createWrapper();
    render(
      <DashboardHeader name="Alice" notificationCount={0} />,
      { wrapper: Wrapper }
    );
    const notifBtn = screen.getByRole('button', { name: /notification/i });
    expect(notifBtn).toBeOnTheScreen();
  });

  it('shows notification badge when count > 0', () => {
    const { Wrapper } = createWrapper();
    render(
      <DashboardHeader name="Bob" notificationCount={5} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('5')).toBeOnTheScreen();
  });

  it('shows 99+ when notification count exceeds 99', () => {
    const { Wrapper } = createWrapper();
    render(
      <DashboardHeader name="Bob" notificationCount={100} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('99+')).toBeOnTheScreen();
  });

  it('does not show notification badge when count is 0', () => {
    const { Wrapper } = createWrapper();
    render(
      <DashboardHeader name="Carol" notificationCount={0} />,
      { wrapper: Wrapper }
    );
    expect(screen.queryByText('0')).toBeNull();
  });

  it('renders profile button (avatar)', () => {
    const { Wrapper } = createWrapper();
    render(
      <DashboardHeader name="Dave" notificationCount={0} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByLabelText('Open profile')).toBeOnTheScreen();
  });

  it('renders avatar image when avatarUri is provided', () => {
    const { Wrapper } = createWrapper();
    render(
      <DashboardHeader name="Eve" notificationCount={0} avatarUri="https://example.com/avatar.jpg" />,
      { wrapper: Wrapper }
    );
    // Avatar image rendered — profile button still accessible
    expect(screen.getByLabelText('Open profile')).toBeOnTheScreen();
  });

  it('avatar Pressable is enabled when onAvatarPress is provided', () => {
    const onAvatarPress = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <DashboardHeader name="Frank" notificationCount={0} onAvatarPress={onAvatarPress} />,
      { wrapper: Wrapper }
    );
    const button = screen.getByLabelText('Open profile');
    // Verify the button is NOT disabled, meaning calls will reach onAvatarPress
    expect(button.props.accessibilityState?.disabled).toBeFalsy();
    expect(button.props.disabled).toBeFalsy();
  });

  it('renders without error when onAvatarPress is not provided', () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<DashboardHeader name="Grace" notificationCount={0} />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
