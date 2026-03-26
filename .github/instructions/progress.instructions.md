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
- **Search tab UI** — Three cards navigate to real screens; Exchange card shows "Coming Soon"
- **Exchange Rate screen** — Full screen with flag + country + buy/sell columns; MSW mock data (10 rows)
- **Interest Rate screen** — Full screen with kind + deposit + rate (purple) columns; MSW mock data (12 rows)
- **Branch Search screen** — MapView (Jakarta region) + floating back button + bottom search panel + filtered branch list; MSW mock data (5 branches)
- **MSW handlers** — `/api/exchange-rates`, `/api/interest-rates`, `/api/branches?q=` all implemented
- **Search API + hooks** — `getExchangeRates`, `getInterestRates`, `getBranches`; `useExchangeRates`, `useInterestRates`, `useBranches(query)`
- **i18n system** — `I18nProvider`, `useTranslation`, dot-prefixed key merging for `en`/`id`
- **API client** — `request<T>()` with AbortController timeout and typed errors
- **Theme system** — `Colors`, `Fonts`, `Spacing`, `Radius` tokens defined
- **Feedback components** — `LoadingState`, `ErrorState`, `EmptyState` with tests
- **Test infrastructure** — Jest + jest-expo, `createWrapper`, `createTestQueryClient`, MSW node server in `jest.setup.js`; 59 tests passing
- **Utility functions** — `date.ts`, `iban.ts`, `money.ts` (all with tests)
- **app.config.js** — Expo config reads `GOOGLE_MAPS_API_KEY` from `.env`; no secrets in `app.json`

## What's Left to Build
- **Maps API key injection** — Run `npx expo prebuild --platform android --clean` to write key into `AndroidManifest.xml`
- **Home tab** — Account summary cards, balance display, recent activity
- **Account feature** — API calls, hooks, and components beyond type stubs
- **MSW handlers** — `/api/accounts` and other future endpoints
- **Currency Exchange flow** — Screen, form, and API integration (no design yet)
- **Real authentication** — Replace setTimeout mock with actual API call
- **Biometric auth** — Implement with `expo-local-authentication`
- **Messages tab** — Notification/message list
- **Settings tab** — Profile, language toggle, app preferences

## Current Status
Search feature screens are fully implemented and functional with MSW mocks. Branch map screen is built but awaiting native rebuild to inject the Google Maps API key. All other infrastructure (auth, home, account) remains stubbed.

## Known Issues
- **Branch map crashes** without Google Maps API key injected — fix: `npx expo prebuild --platform android --clean && npx expo run:android`
- `features/auth/types.ts` duplicates `Account` type from `features/account/types.ts` — needs cleanup
- No auth guard — navigating directly to `/(tabs)` is possible without sign-in
- Typed routes (`typedRoutes: true`) require `as any` cast for `app/search/*` routes until Expo regenerates its route manifest

## Evolution of Decisions
- MSW chosen for development mocking to avoid needing a running backend during early development
- Feature-based folder structure chosen for scalability and team separation of concerns
- `@tanstack/react-query` chosen for server state (no Redux/Zustand)
- Custom i18n system (not `i18next`) to keep bundle lightweight
- `app.config.js` adopted over `app.json` to support environment variable injection for secrets
- `react-native-maps` chosen for Branch map; requires Google Maps API key and native rebuild
- Currency Exchange (4th search card) intentionally deferred — no design spec provided
