import { useState, useEffect } from 'react';
import { menuService } from '../services';
import type { AccountType, MenuItem } from '../types';

interface MenuState {
  items: MenuItem[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches all menu items from GET /api/menu.
 */
export function useMenu(): MenuState {
  const [state, setState] = useState<MenuState>({
    items: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    menuService.loadMenu()
      .then((items) => {
        if (!cancelled) setState({ items, isLoading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ items: [], isLoading: false, error: err });
      });

    return () => { cancelled = true; };
  }, []);

  return state;
}

/**
 * Fetches menu items for a specific account type from GET /api/menu/{accountType}.
 * Re-fetches automatically when accountType changes.
 */
export function useMenuByAccountType(accountType: AccountType): MenuState {
  const [state, setState] = useState<MenuState>({
    items: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    setState({ items: [], isLoading: true, error: null });

    menuService.loadMenuByAccountType(accountType)
      .then((items) => {
        if (!cancelled) setState({ items, isLoading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ items: [], isLoading: false, error: err });
      });

    return () => { cancelled = true; };
  }, [accountType]);

  return state;
}
