import { menuApi } from '../api';
import type { AccountType, MenuItem } from '../types';

/**
 * Fetch all menu items from the server.
 */
async function loadMenu(): Promise<MenuItem[]> {
  return menuApi.getMenu();
}

/**
 * Fetch menu items for a specific account type.
 * accountType must be 'REGULAR' or 'PREMIUM'.
 */
async function loadMenuByAccountType(accountType: AccountType): Promise<MenuItem[]> {
  return menuApi.getMenuByAccountType(accountType);
}

export const menuService = { loadMenu, loadMenuByAccountType };
