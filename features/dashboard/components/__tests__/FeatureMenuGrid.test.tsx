import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { FeatureMenuGrid } from '../FeatureMenuGrid';
import { createWrapper } from '@/test-utils/createWrapper';
import type { Privilege } from '../../types';

function makePrivilege(code: string, enabled = true): Privilege {
  return { code, title: `Feature ${code}`, icon: 'card', color: '#3629B7', enabled };
}

describe('FeatureMenuGrid', () => {
  it('renders all enabled privileges', () => {
    const { Wrapper } = createWrapper();
    const privileges = [
      makePrivilege('1'),
      makePrivilege('2'),
      makePrivilege('3'),
    ];
    render(<FeatureMenuGrid privileges={privileges} />, { wrapper: Wrapper });
    expect(screen.getByText('Feature 1')).toBeOnTheScreen();
    expect(screen.getByText('Feature 2')).toBeOnTheScreen();
    expect(screen.getByText('Feature 3')).toBeOnTheScreen();
  });

  it('does not render disabled privileges', () => {
    const { Wrapper } = createWrapper();
    const privileges = [
      makePrivilege('A'),
      makePrivilege('B', false),   // disabled
    ];
    render(<FeatureMenuGrid privileges={privileges} />, { wrapper: Wrapper });
    expect(screen.getByText('Feature A')).toBeOnTheScreen();
    expect(screen.queryByText('Feature B')).toBeNull();
  });

  it('renders empty grid without error', () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<FeatureMenuGrid privileges={[]} />, { wrapper: Wrapper })
    ).not.toThrow();
  });

  it('splits items into rows of 3', () => {
    const { Wrapper } = createWrapper();
    const privileges = Array.from({ length: 7 }, (_, i) => makePrivilege(String(i + 1)));
    render(<FeatureMenuGrid privileges={privileges} />, { wrapper: Wrapper });
    // All 7 items should be rendered
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByText(`Feature ${i}`)).toBeOnTheScreen();
    }
  });

  it('renders correctly with a single item', () => {
    const { Wrapper } = createWrapper();
    render(<FeatureMenuGrid privileges={[makePrivilege('X')]} />, { wrapper: Wrapper });
    expect(screen.getByText('Feature X')).toBeOnTheScreen();
  });
});
