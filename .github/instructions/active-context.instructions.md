---
applyTo: '**'
---

# Active Context

## Current Work Focus
Memory bank initialization — establishing baseline documentation from the current codebase state.

## Recent Changes
- Populated all memory bank instruction files from codebase inspection
- Codebase is in early-stage scaffolding: auth, account, and search features are stubbed out

## Current State
- **Auth**: `SignInScreen` is implemented with email/password form, biometric placeholder, and a mocked 2-second login delay that routes to `/(tabs)`.
- **Home Tab** (`app/(tabs)/index.tsx`): Stub showing "Welcome to BankEase" text.
- **Search Tab** (`app/(tabs)/search.tsx`): Four `SearchCategoryCard` entries (Branch Search, Interest Rate, Exchange Rate, Currency Exchange) all wired to a "Coming Soon" alert.
- **Messages / Settings Tabs**: Placeholder screens.
- **MSW handlers** (`mocks/handlers.ts`): Empty — no API endpoints mocked yet.
- **Account feature**: Types defined (`Account`, `AccountStatus`), API/hooks/services stubs only.

## Next Steps
1. Build out Home tab with account summary cards using `features/account`
2. Implement MSW handlers for `/api/accounts` and other endpoints
3. Wire Search categories to real navigation routes instead of alerts
4. Implement Branch Search, Interest Rate, Exchange Rate, and Currency Exchange flows
5. Integrate real authentication API (replace setTimeout mock)
6. Add biometric auth using `expo-local-authentication`

## Active Decisions & Considerations
- Auth is intentionally mocked; do not add real API calls until auth endpoint is specified
- `SearchCategoryCard` currently receives `bgColor` prop but the component itself doesn't render a background color — this is a known gap
- `features/auth/types.ts` and `features/account/types.ts` contain identical `Account` type — likely a copy/paste artifact; auth types should be cleaned up
- All logging must go through `utils/log.ts` (respects `LOG_ENABLED` flag)

## Important Patterns
- Always wrap test renders with `createWrapper` from `test-utils/`
- Feature translations use prefixed keys: `common.*`, `account.*`, `searchScreen.*`
- New features should follow the `features/<name>/{types, api, components, hooks, services, locales}` structure
- Use `Colors`, `Fonts`, `Spacing`, `Radius` from `constants/theme.ts` — no magic values
