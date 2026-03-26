---
applyTo: '**'
---

# System Patterns

## Architecture
Feature-based folder structure under `features/`. Each feature is self-contained with:
- `types.ts` — TypeScript interfaces
- `api/index.ts` — API call functions using `core/api/client.ts`
- `components/index.ts` — Feature UI components (barrel export)
- `hooks/index.ts` — Custom React hooks
- `services/index.ts` — Business logic / service layer
- `locales/en.json` + `locales/id.json` — Feature-scoped translations

Current features: `auth`, `account`, `search`

## Routing
Expo Router (file-based). Key routes:
- `app/index.tsx` — Entry point (redirects to sign-in or tabs)
- `app/_layout.tsx` — Root layout: providers, fonts, MSW init, splash control
- `app/(tabs)/_layout.tsx` — Tab shell using `AnimatedTabBar`
- `app/(tabs)/index.tsx` — Home tab (stub)
- `app/(tabs)/search.tsx` — Search tab with `SearchCategoryCard` grid
- `app/(tabs)/messages.tsx` — Placeholder
- `app/(tabs)/settings.tsx` — Placeholder
- `app/modal.tsx` — Modal route

## State Management
- Server state: `@tanstack/react-query` (QueryClient configured in `app/_layout.tsx`)
  - `retry: 2`, `staleTime: 30s`, `refetchOnReconnect: true`
  - Mutations: `retry: false`
- Local/form state: `react-hook-form`
- No global client state library (no Redux/Zustand)

## API Layer
`core/api/client.ts` — `request<T>(endpoint, options)` wraps fetch with:
- AbortController timeout (`API_TIMEOUT_MS = 10000ms`)
- Typed error parsing (`ApiError`, `NetworkError`, `InsufficientFundsError`, `ServiceUnavailableError`)
- Base URL from `constants/index.ts` (`API_BASE_URL = "http://localhost:3000"`)

## Internationalisation (i18n)
`core/i18n/` — Custom i18n system:
- `translations.ts` merges common + feature locales using dot-prefixed keys (`common.*`, `account.*`, `searchScreen.*`)
- `context.tsx` — `I18nProvider` with locale state
- `useTranslation.ts` — `useTranslation()` hook returning `{ t, locale, setLocale }`
- Supported locales: `en`, `id`

## Theming
`constants/theme.ts` exports:
- `Colors` — light/dark palettes + brand tokens (`primary: '#3629B7'`)
- `Fonts` — Poppins weight map
- `Spacing` / `Radius` — design system tokens
`hooks/use-color-scheme.ts` (+ `.web.ts`) — detects system color scheme

## UI Components (`components/`)
- `ui/themed-text.tsx`, `ui/themed-view.tsx`, `ui/themed-button.tsx` — base themed primitives
- `ui/animated-tab-bar.tsx` — custom animated bottom tab bar
- `ui/pill-tab-button.tsx` — pill-style tab button used in animated bar
- `feedback/loadingState.tsx`, `errorState.tsx`, `emptyState.tsx` — standard feedback states

## Testing Patterns
- Jest + `jest-expo` + `@testing-library/react-native`
- Test wrappers: `test-utils/createWrapper.tsx` (wraps with QueryClient + I18nProvider)
- Query client factory: `test-utils/createTestQueryClient.ts`
- Test files colocated in `__tests__/` subdirectories

## Mock Service Worker
`mocks/` — MSW v2:
- `handlers.ts` — request handlers (currently empty, ready to add)
- `server.node.ts` — Node server for Jest
- `server.ts` — browser/native server
- `useMSW.ts` — hook used in `app/_layout.tsx` to wait for MSW readiness before hiding splash
