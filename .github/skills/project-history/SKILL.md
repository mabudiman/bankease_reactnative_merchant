---
name: project-history
description: 'Review completed features, decision evolution, and project history for BankEase Merchant. Use when planning new features, auditing why something was built a certain way, checking what has been implemented, or reviewing the project timeline.'
argument-hint: 'Topic to look up, e.g. "auth decisions", "what features are done", "dashboard evolution", "testing status"'
---

# Project History

## When to Use
- Planning a new feature and need to know what already exists
- Auditing why a specific decision was made
- Checking the timeline of feature development
- Reviewing test coverage status

---

## Completed Features (Detailed)

### Core Infrastructure
- [x] Expo Router setup with tab navigation (Home + Payouts → later 4-tab)
- [x] TanStack Query setup with `QueryClientProvider`
- [x] MSW mock server for development and testing
- [x] Core API client (`core/api/client.ts`) with timeout & error parsing
- [x] Error hierarchy (`core/api/errors.ts`) — 5 error types with `recoverable` flag
- [x] i18n system (`core/i18n/`) — English + Indonesian
- [x] Theme system with dark/light mode support

### Feature: Auth (Local Dummy)
- [x] `SignInScreen` — sign-in screen, navigation to sign-up, local dummy login via AsyncStorage
- [x] `SignUpScreen` — sign-up screen, two-layer iOS layout, route `app/sign-up.tsx`
- [x] `authService` — `features/auth/services/auth-service.ts`, AsyncStorage-based signIn/signUp/getSession/clearSession/getSessionAccount
- [x] Seed accounts: demo-001 (`081234567890` / `demo1234`), demo-002 (`089876543210` / `premium1234`)
- [x] Two-way navigation sign-in ↔ sign-up via Expo Router
- [x] Login success redirect to `/(tabs)` via `router.replace`
- [x] i18n auth keys in `features/auth/locales/en.json` + `id.json`
- [ ] Auth backend (MSW/API) — deferred
- [ ] Session restoration on cold-start — deferred

### Feature: Dashboard Home
- [x] `DashboardHeader` — LinearGradient purple–blue, avatar (with profile image if available), personal greeting, notification badge (AsyncStorage)
- [x] `DashboardHeader` prop `avatarUri?: string` — renders profile image from API, fallback Ionicons
- [x] `useDashboard()` hook — `useFocusEffect` + `useCallback`, auto-refresh on tab focus
- [x] `MenuGridItem` — Pressable card, Ionicons icon + label, Alert "Coming Soon" on tap
- [x] `FeatureMenuGrid` — plain `View` + `map` per row (not FlatList)
- [x] `dashboardService.loadCards` — AsyncStorage `@dashboard:cards`, upsert seed per accountId+cardId
- [x] `dashboardService.getPrivileges` — hardcoded ROLE_MAP: demo-001 (3 menu), demo-002 (9 menu), new accounts (1 menu)
- [x] `dashboardService.getNotificationCount` — AsyncStorage, default 3
- [x] Seed cards: demo-001 (VISA navy + MC purple), demo-002 (VISA green + MC dark navy)
- [x] Floating card navbar via `tabBar` prop custom `FloatingTabBar`
- [x] `app/_i18n.ts` — prefix `_` to avoid Expo Router route
- [x] `features/dashboard/locales/en.json` + `id.json`

### Feature: Profile Edit
- [x] `ProfileScreen` — `features/profile/components/ProfileScreen.tsx`, routed via `app/(tabs)/settings.tsx`
- [x] `useProfile()` hook — load & save via real API, returns `saveProfile: (data) => Promise<boolean>`
- [x] `profileApi.getProfile(uuid)` — GET `http://4.193.104.245:8080/api/profile/{uuid}`
- [x] `profileApi.updateProfile(uuid, data)` — PUT with payload
- [x] `profileService` — `PROFILE_ID_MAP` for demo ID → API UUID mapping
- [x] Form pre-fill with `hasPopulated` ref
- [x] Snapshot pattern for revert-on-failure
- [x] Confirm button disabled when any field empty
- [x] Alert Success/Failed based on API result
- [x] Profile image in avatar with fallback
- [x] `displayName` local state

### Feature: Merchant Dashboard
- [x] `useMerchant()` — query available & pending balance
- [x] `useActivityInfinite()` — infinite scroll cursor-based pagination
- [x] `HomeCard` — balance display
- [x] `ActivityRow` — transaction item (tappable via `onPress` prop)
- [x] `ActivityPreview` — preview 15 transactions
- [x] `ActivityDetailModal` — transaction detail modal
- [x] `ActivityFilterBar` — quick filter chips (All / Today / Last 7 / Last 30 Days)
- [x] Date filter server-side with API params, auto pagination reset

### Feature: Payout
- [x] `PayoutForm` — RHF form, IBAN & amount validation
- [x] `PayoutConfirmModal` — confirmation with masked IBAN
- [x] `PayoutResultModal` — success/error result with actions
- [x] `usePayoutFlow` — orchestration hook (idempotency, biometric, double-submit guard)
- [x] `useCreatePayout` — React Query mutation
- [x] `mapErrorMessage()` — error to user-friendly message

### Security
- [x] Custom native module `expo-screen-security`
- [x] `getDeviceId()` — device fingerprinting
- [x] `authenticateWithBiometrics()` — FaceID/TouchID/Fingerprint
- [x] `addScreenshotListener()` — screenshot detection
- [x] Biometric threshold: 100,000 minor units (£1,000)
- [x] Idempotency key: UUID via `expo-crypto`

### Utils
- [x] `utils/money.ts` — minor/major unit conversion, currency format
- [x] `utils/iban.ts` — IBAN validation & normalization
- [x] `utils/date.ts` — date format + `getDateRangeForFilter()` helper

### Testing (127 tests passing — 27 Mar 2026)
- [x] Unit tests: API client, errors, utils, components
- [x] Unit tests: auth-service (signIn, signUp, getSession, clearSession, getSessionAccount)
- [x] Unit tests: dashboard-service (loadCards, getPrivileges, getNotificationCount)
- [x] Unit tests: search API (10 tests) — `features/search/api/__tests__/search-api.test.ts`
- [x] Unit tests: search hooks (8 tests) — `features/search/hooks/__tests__/search-hooks.test.ts`
- [x] Unit tests: SearchCategoryCard (6 tests)
- [x] Unit tests: ExchangeRateRow (6 tests)
- [x] Unit tests: BranchRow (5 tests)
- [x] E2E tests (Maestro): 8 flow scenarios
- [x] MSW handlers for all endpoints
- [x] 90 tests passing (25 Mar 2026) → 127 tests passing (27 Mar 2026)

---

## Decision Evolution

| Date | Decision | Rationale |
|------|----------|-----------|
| Init | Feature-first folder layout | Domain isolation, scales well |
| Init | TanStack Query (not Redux/Zustand) | App is read-heavy, single main mutation |
| Init | Custom native module (not third-party lib) | Project requirement |
| Init | Client-generated idempotency key | No round-trip, works offline-first |
| Init | `ref` for double-submit guard | Doesn't trigger re-render |
| 16 Mar | `useState<T \| null>` local for detail modal | Pure UI state, no global/hook needed |
| 16 Mar | Optional `onPress` on `ActivityRow` | Backward-compatible reuse |
| 17 Mar | Query key includes filter params `["activity", dateFrom, dateTo]` | TanStack Query auto-resets pagination on key change |
| 17 Mar | Server-side filter (API params) | Efficient for large data |
| 17 Mar | Quick chips not DatePicker | No date picker library; faster UX for common ranges |
| 25 Mar | Sign-up as separate Expo Router route | Clean navigation, doesn't disturb sign-in |
| 25 Mar | AsyncStorage for dummy auth (`@auth:accounts`, `@auth:session`) | Sign-up accounts must persist across restarts |
| 25 Mar | White sheet as normal vertical section (not absolute overlay) | Fixed root cause of bottom sheet overlap bug |
| 25 Mar | Return to sign-in after sign-up (no auto-login) | More explicit, easier to test |
| 25 Mar | Flat dotted keys for locale files | Compatible with `flattenWithPrefix` (one-level flatten) |
| 25 Mar | Removed visual `+62` prefix from phone field | Inconsistent format was root cause of login failure |
| 25 Mar | `.trim()` password in signUp and signIn | Android keyboard adds trailing whitespace |
| 25 Mar | `loadAccounts()` upsert by id (not seed-when-null) | Pre-existing storage wouldn't get demo accounts |
| 25 Mar | Hardcoded ROLE_MAP in dashboard-service | Privileges don't change at runtime |
| 25 Mar | New accounts get DEFAULT_ROLE (ACCOUNT_CARD only) | Unknown ID → minimal access |
| 25 Mar | `loadCards` upsert per-card by id | Consistent with `loadAccounts` pattern |
| 25 Mar | 4-tab bottom nav replacing 2-tab | Fintech dashboard needs more nav; Accounts tab in menu grid |
| 25 Mar | `AccountCard` with `width:'100%'` | Wrapper (stacked carousel) controls width |
| 25 Mar | Stacked card carousel (not horizontal FlatList) | Visual stacking effect; `reverse()` for z-order |
| 25 Mar | `FeatureMenuGrid` plain View+map (not FlatList) | FlatList `scrollEnabled=false` has Android height bug |
| 25 Mar | Custom `FloatingTabBar` via `tabBar` prop | `tabBarStyle` unreliable for large borderRadius + shadow on Android |
| 25 Mar | `Pressable` for tab button (not PlatformPressable) | PlatformPressable on iOS renders RN Nav internal children |
| 25 Mar | `navigation.emit({ type:'tabPress' })` for tab nav | Official pattern preserving all TabPress listeners |
| 25 Mar | `app/_i18n.ts` with underscore prefix | Prevents Expo Router from treating it as a route |
| 25 Mar | 3-color horizontal gradient for cards | Deeper, modern visual |
| 26 Mar | Profile Edit with real API GET/PUT | Merchants need to view & update bank info |
| 26 Mar | `profileService` PROFILE_ID_MAP | Demo accounts use local dummy ID, API needs real UUID |
| 26 Mar | `saveProfile` returns boolean, doesn't update state | Updating state re-triggers useEffect and resets form |
| 26 Mar | `hasPopulated` ref for one-time form fill | Prevents form overwrite on state change |
| 26 Mar | `snapshot` ref for revert-on-failure | Failed save reverts to last known good; success updates snapshot |
| 26 Mar | `displayName` local state | Immediate name update on save without re-fetch |
| 26 Mar | `useDashboard` switched to `useFocusEffect` | `useEffect([])` only runs on mount, not on tab return |
| 26 Mar | Profile image in DashboardHeader via `avatarUri` prop | Consistent with ProfileScreen; fallback to Ionicons |
| 27 Mar | Search feature unit tests (5 files, 37 tests) | API via MSW, hooks via renderHook+waitFor, components via render+screen |
| 27 Mar | Import `MOCK_*` from mocks/data.ts for assertions | Avoid magic numbers; tests stay valid when seed data changes |
