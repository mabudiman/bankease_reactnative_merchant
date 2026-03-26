---
applyTo: '**'
---

# Progress

## What Works
- **Project scaffold** — Expo Router file-based routing wired up with tab shell
- **Root layout** — Fonts (Poppins), QueryClient, I18nProvider, MSW initialization all configured
- **Splash screen** — Hides only after fonts + MSW are ready
- **Authentication UI** — `SignInScreen` with email/password form, form validation, loading state, biometric button placeholder; mocked login (2s delay → `/(tabs)`)
- **Animated tab bar** — `AnimatedTabBar` custom component with `PillTabButton` in use
- **Search tab UI** — Four `SearchCategoryCard` tiles rendered with illustrations and translations
- **i18n system** — `I18nProvider`, `useTranslation`, dot-prefixed key merging for `en`/`id`
- **API client** — `request<T>()` with AbortController timeout and typed errors
- **Theme system** — `Colors`, `Fonts`, `Spacing`, `Radius` tokens defined
- **Feedback components** — `LoadingState`, `ErrorState`, `EmptyState` with tests
- **Test infrastructure** — Jest + jest-expo, `createWrapper`, `createTestQueryClient`, MSW node server in `jest.setup.js`
- **Utility functions** — `date.ts`, `iban.ts`, `money.ts` (all with tests)
- **MSW setup** — Server and browser handlers wired; `handlers.ts` ready to populate

## What's Left to Build
- **Home tab** — Account summary cards, balance display, recent activity
- **Account feature** — API calls, hooks, and components beyond type stubs
- **MSW handlers** — `/api/accounts` and all other endpoints
- **Branch Search flow** — Screen, map/list view, API integration
- **Interest Rate flow** — Screen and API integration
- **Exchange Rate flow** — Screen and API integration
- **Currency Exchange flow** — Screen, form, and API integration
- **Real authentication** — Replace setTimeout mock with actual API call
- **Biometric auth** — Implement with `expo-local-authentication`
- **Messages tab** — Notification/message list
- **Settings tab** — Profile, language toggle, app preferences
- **Auth translations** — `features/auth/locales/` exists but may be empty
- **`bgColor` prop on `SearchCategoryCard`** — Component doesn't consume it yet; needs wiring

## Current Status
Early-stage scaffolding. Core infrastructure is solid. Feature screens are stubs pending product/API decisions.

## Known Issues
- `features/auth/types.ts` duplicates `Account` type from `features/account/types.ts` — needs cleanup
- `SearchCategoryCard` accepts `bgColor` prop but ignores it in styles
- No auth guard — navigating directly to `/(tabs)` is possible without sign-in
- `search.tsx` passes `bgColor` prop to `SearchCategoryCard` which TypeScript may flag as an unknown prop

## Evolution of Decisions
- MSW chosen for development mocking to avoid needing a running backend during early development
- Feature-based folder structure chosen for scalability and team separation of concerns
- `@tanstack/react-query` chosen for server state (no Redux/Zustand)
- Custom i18n system (not `i18next`) to keep bundle lightweight
