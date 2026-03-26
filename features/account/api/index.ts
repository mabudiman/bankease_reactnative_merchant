import { request } from '@/core/api/client';
import type { AccountType, MenuItem } from '../types';

/** API wraps the array in a `menus` key */
interface MenuResponse {
  menus: MenuItem[];
}

/**
 * Fetch all menu items.
 * GET /api/menu
 */
export async function getMenu(): Promise<MenuItem[]> {
  const res = await request<MenuResponse>('/api/menu');
  return res.menus;
}

/**
 * Fetch menu items filtered by account type.
 * GET /api/menu/{accountType}  — accountType is 'REGULAR' or 'PREMIUM'
 */
export async function getMenuByAccountType(accountType: AccountType): Promise<MenuItem[]> {
  const res = await request<MenuResponse>(`/api/menu/${accountType}`);
  return res.menus;
}

export const menuApi = { getMenu, getMenuByAccountType };
