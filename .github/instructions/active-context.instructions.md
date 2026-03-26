---
applyTo: '**'
---

# Active Context

## Current Work Focus
Search feature screens implementation — Branch Search, Interest Rate, and Exchange Rate screens built and wired. Working on Google Maps API key injection for the Branch screen.

## Recent Changes
- Installed `react-native-maps` for Branch Search map view
- Added `ExchangeRate`, `InterestRate`, `Branch` types to `features/search/types.ts`
- Populated `mocks/data.ts` with 10 exchange rates, 12 interest rates, 5 branches
- Added MSW handlers for `GET /api/exchange-rates`, `/api/interest-rates`, `/api/branches?q=`
- Created `features/search/api/index.ts` and `features/search/hooks/index.ts`
- Extended search translations (`en.json` / `id.json`) with column headers and screen titles
- Created `app/search/_layout.tsx` route group; registered `search` in root `_layout.tsx`
- Wired Branch/Interest Rate/Exchange Rate cards to `router.push()`; Exchange keeps "Coming Soon"
- Built screens: `app/search/exchange-rate.tsx`, `app/search/interest-rate.tsx`, `app/search/branch.tsx`
- Built components: `ExchangeRateRow.tsx`, `BranchRow.tsx`; fixed `bgColor` prop on `SearchCategoryCard`
- Created `app.config.js` (replaces `app.json` as Expo config) to read `GOOGLE_MAPS_API_KEY` from `.env`
- `.env` holds the Google Maps API key (git-ignored)

## Current State
- **Auth**: Mocked (2s delay → `/(tabs)`). No real API.
- **Home Tab**: Stub — "Welcome to BankEase" text only.
- **Search Tab**: All 3 working cards navigate to real screens. Exchange card shows "Coming Soon".
- **Exchange Rate screen**: Functional with MSW mock data — flag emoji + country + buy/sell columns.
- **Interest Rate screen**: Functional with MSW mock data — kind + deposit + rate (purple) columns.
- **Branch screen**: Map + bottom search panel built. **Blocked**: Google Maps API key not yet injected into `AndroidManifest.xml` — requires `npx expo prebuild --platform android --clean` followed by `npx expo run:android`.
- **Messages / Settings Tabs**: Placeholder screens.
- **Account feature**: Types defined, API/hooks/services stubs only.

## Next Steps
1. Run `npx expo prebuild --platform android --clean && npx expo run:android` to inject Maps key
2. Build out Home tab with account summary cards using `features/account`
3. Implement MSW handlers for `/api/accounts`
4. Integrate real authentication API (replace setTimeout mock)
5. Add biometric auth using `expo-local-authentication`
6. Messages tab — notification/message list
7. Settings tab — profile, language toggle

## Active Decisions & Considerations
- Auth is intentionally mocked; do not add real API calls until auth endpoint is specified
- `app.config.js` is now the Expo config entry point — `app.json` is a clean fallback with no secrets
- Google Maps API key lives in `.env` as `GOOGLE_MAPS_API_KEY` — never commit this key
- After getting a permanent key, replace `.env` value and run `expo prebuild` again
- Currency Exchange (4th card) intentionally kept as "Coming Soon" — no design provided yet
- `features/auth/types.ts` duplicates `Account` type from `features/account/types.ts` — still needs cleanup
- All logging must go through `utils/log.ts` (respects `LOG_ENABLED` flag)
- Typed routes (`experiments.typedRoutes`) require `as any` cast for new `app/search/*` routes until Expo regenerates the type manifest

## Important Patterns
- Always wrap test renders with `createWrapper` from `test-utils/`
- Feature translations use prefixed keys: `common.*`, `account.*`, `searchScreen.*`
- New features should follow the `features/<name>/{types, api, components, hooks, services, locales}` structure
- Use `Colors`, `Fonts`, `Spacing`, `Radius` from `constants/theme.ts` — no magic values
- New search sub-screens: back button via `router.back()` with `Ionicons chevron-back`, `SafeAreaView` + white bg
- Branch screen bottom panel: fixed (non-draggable), `height: "45%"`, `borderTopLeftRadius: Radius.lg`
