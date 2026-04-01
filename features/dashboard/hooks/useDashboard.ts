import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { authService } from '@/features/auth/services/auth-service';
import { dashboardService } from '../services/dashboard-service';
import { profileService } from '@/features/profile/services/profile-service';
import { profileEvents } from '@/features/profile/profileEvents';
import { menuApi } from '@/features/account/api';
import type { PaymentCard, Privilege, CardBrand } from '../types';
import type { LocalAuthAccount } from '@/features/auth/types';
import type { MenuItem, AccountType } from '@/features/account/types';

function getProfileId(accountId: string): string {
  return accountId;
}

// ─── Card enrichment helpers ─────────────────────────────────────────────────

function maskCardNumber(raw: string): string {
  const digits = raw.replaceAll(/\D/g, '');
  const first4 = digits.slice(0, 4);
  const last4 = digits.slice(-4);
  return `${first4}  ••••  ••••  ${last4}`;
}

function detectBrand(cardProvider: string): CardBrand {
  if (/mastercard|mc/i.test(cardProvider)) return 'MASTERCARD';
  return 'VISA'; // default to VISA when unknown or empty
}

const BRAND_GRADIENTS: Record<CardBrand, string[]> = {
  VISA: ['#1A1563', '#1E2FA0', '#3B7ED4'],
  MASTERCARD: ['#2D1B69', '#5B2D8E', '#8E4EC6'],
};

// ─── Material Symbols → Ionicons mapping ────────────────────────────────────

const MATERIAL_TO_IONICONS: Record<string, string> = {
  id_card: 'card',
  send_money: 'swap-horizontal',
  payment: 'receipt',
  add_card: 'add-circle',
  trending_up: 'trending-up',
  history: 'time',
  account_balance: 'business',
  settings: 'settings',
  star: 'star',
};

const MENU_COLORS = [
  '#3629B7', '#1A73E8', '#F4511E', '#E91E63', '#00897B',
  '#039BE5', '#FB8C00', '#8E24AA', '#43A047',
];

function extractMaterialIconName(iconUrl: string): string {
  const match = /icon_names=([^&\s]+)/.exec(iconUrl);
  return match?.[1] ?? '';
}

function mapMenuItemsToPrivileges(items: MenuItem[]): Privilege[] {
  return items
    .filter((item) => item.is_active)
    .sort((a, b) => a.index - b.index)
    .map((item, idx) => ({
      code: item.id,
      title: item.title,
      icon: MATERIAL_TO_IONICONS[extractMaterialIconName(item.icon_url)] ?? 'apps',
      color: MENU_COLORS[idx % MENU_COLORS.length],
      enabled: true,
    }));
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface DashboardState {
  user: LocalAuthAccount | null;
  displayName: string;
  profileImage?: string;
  cards: PaymentCard[];
  privileges: Privilege[];
  notificationCount: number;
  isLoading: boolean;
  /** true only on first load — background refreshes keep the existing card visible */
  isInitialLoad: boolean;
}

export function useDashboard(): DashboardState {
  const [state, setState] = useState<DashboardState>({
    user: null,
    displayName: '',
    profileImage: undefined,
    cards: [],
    privileges: [],
    notificationCount: 0,
    isLoading: true,
    isInitialLoad: true,
  });

  // ─── Stable load function (not tied to useFocusEffect closure) ───────────────
  const load = useCallback(async (background = false) => {
    console.log('[useDashboard] load() called, background:', background);
    // On background refresh (triggered by profileSaved), keep existing UI visible
    setState((prev) => ({ ...prev, isLoading: !background }));

    const user = await authService.getSessionAccount();
    if (!user) {
      console.log('[useDashboard] no user session, aborting');
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const [cards, notificationCount, profile] = await Promise.all([
      dashboardService.loadCards(user.id),
      dashboardService.getNotificationCount(user.id),
      profileService.loadProfile(getProfileId(user.id)),
    ]);

    console.log('[useDashboard] profile:', JSON.stringify(profile, null, 2));

    // Fetch menu items based on accountType from profile
    const accountType = (profile.accountType || 'REGULAR') as AccountType;
    let menuItems: MenuItem[] = [];
    try {
      menuItems = await menuApi.getMenuByAccountType(accountType);
      console.log('[useDashboard] menuItems:', JSON.stringify(menuItems, null, 2));
    } catch (err) {
      console.warn('[useDashboard] menu fetch failed:', err);
    }

    const privileges = mapMenuItemsToPrivileges(menuItems);

    // Build a card from profile data if no stored cards exist (real API user)
    const baseCards: PaymentCard[] = cards.length > 0 ? cards : (() => {
      const brand = detectBrand(profile.cardProvider);
      return [{
        id: `card-${profile.accountId}`,
        accountId: user.id,
        holderName: profile.transactionName || user.name,
        cardLabel: profile.cardProvider || 'BRI Card',
        maskedNumber: profile.cardNumber && profile.cardNumber !== 'xxx'
          ? maskCardNumber(profile.cardNumber)
          : '••••  ••••  ••••  ••••',
        balance: profile.balance,
        currency: profile.currency || 'IDR',
        brand,
        gradientColors: BRAND_GRADIENTS[brand],
      }];
    })();

    // Enrich the first card with real API profile data; leave other cards intact
    const enrichedCards: PaymentCard[] = baseCards.map((card, idx) => {
      if (idx !== 0 || !profile.transactionName) return card;
      const brand = detectBrand(profile.cardProvider);
      return {
        ...card,
        holderName: profile.transactionName,
        cardLabel: profile.cardProvider || card.cardLabel,
        maskedNumber: profile.cardNumber
          ? maskCardNumber(profile.cardNumber)
          : card.maskedNumber,
        balance: profile.balance > 0 ? profile.balance : card.balance,
        currency: profile.currency || card.currency,
        brand,
        gradientColors: BRAND_GRADIENTS[brand],
      };
    });

    const displayName = profile.transactionName || user.name;
    const profileImage = profile.image || undefined;

    console.log('[useDashboard] load() done — displayName:', displayName);
    setState({ user, displayName, profileImage, cards: enrichedCards, privileges, notificationCount, isLoading: false, isInitialLoad: false });
  }, []);

  // Re-fetch every time the dashboard screen gains focus
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Re-fetch immediately whenever profile is saved (even when dashboard is not focused)
  useEffect(() => {
    return profileEvents.onProfileSaved(() => {
      console.log('[useDashboard] profileSaved event received → calling load(background=true)');
      load(true);
    });
  }, [load]);

  return state;
}
