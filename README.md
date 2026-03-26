"# BankEase Merchant

A training project — a React Native mobile banking app for merchants. Built on Expo, it covers common banking app patterns: account overview, branch search, interest rates, exchange rates, and currency exchange — delivered through a polished UI with multi-language support.

---

## Features

- **Authentication** — Email/password sign-in with biometric login placeholder
- **Branch Search** — Map view of nearby bank branches with search filtering
- **Exchange Rates** — Live buy/sell exchange rate table by currency
- **Interest Rates** — Deposit interest rate lookup by product type
- **Multi-language** — English and Indonesian (runtime locale switching)
- **Dark/Light mode** — Automatic system theme detection
- **Offline-tolerant** — API timeout handling, loading/error/empty states

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81.5 + Expo SDK 54 |
| Language | TypeScript ~5.9 (strict) |
| Routing | Expo Router ~6.0 (file-based) |
| Server state | @tanstack/react-query v5 |
| Forms | react-hook-form v7 |
| Maps | react-native-maps (Google Maps) |
| Animation | react-native-reanimated v4 |
| Mocking | MSW v2 |
| Testing | Jest 29 + jest-expo + @testing-library/react-native |

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode for native builds
- A Google Maps API key (for the Branch Search map)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

> **Never commit the `.env` file.** It is already in `.gitignore`.

### 3. Start the development server

```bash
npx expo start
```

### 4. Run on a device or emulator

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios

# Web
npx expo start --web
```

> **Note:** The Branch Search screen requires a native build to inject the Google Maps API key.  
> Run `npx expo prebuild --platform android --clean && npx expo run:android` after setting `GOOGLE_MAPS_API_KEY` in `.env`.

---

## Project Structure

```
app/                   # Expo Router file-based routes
  (tabs)/              # Main tab shell (Home, Search, Messages, Settings)
  search/              # Search sub-screens (Branch, Exchange Rate, Interest Rate)
components/            # Shared UI components (themed primitives, feedback states, tab bar)
constants/             # Theme tokens (Colors, Fonts, Spacing, Radius) and app constants
core/
  api/                 # API client with timeout + typed error handling
  i18n/                # Custom i18n system (en/id, locale provider, useTranslation hook)
features/              # Feature modules (auth, account, search)
  <feature>/
    types.ts           # TypeScript interfaces
    api/               # API call functions
    components/        # Feature-specific UI components
    hooks/             # Custom React hooks
    services/          # Business logic
    locales/           # en.json / id.json translations
hooks/                 # Shared hooks (color scheme, theme color)
mocks/                 # MSW request handlers and mock data
test-utils/            # Test wrapper factory (QueryClient + I18nProvider)
utils/                 # Utility functions (date, IBAN, money formatting)
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run on web |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Jest in watch mode |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint via expo lint |

---

## App Configuration

The Expo config lives in `app.config.js` (not `app.json`) to support environment variable injection at build time.

| Setting | Value |
|---|---|
| Bundle ID (iOS) | `com.bankease.merchant` |
| Package (Android) | `com.bankease.merchant` |
| Deep link scheme | `bankeasemerchant` |
| New Architecture | Enabled |

---

## Testing

```bash
npm test
```

Tests are colocated in `__tests__/` subdirectories alongside source files. The test setup uses:

- `createWrapper` — wraps renders with `QueryClient` + `I18nProvider`
- MSW node server — intercepts API calls during tests
- `createTestQueryClient` — isolated query client per test

---

## Environment

| Constant | Default | Description |
|---|---|---|
| `API_BASE_URL` | `http://localhost:3000` | Backend API base URL |
| `API_TIMEOUT_MS` | `10000` | Request timeout in milliseconds |
| `LOG_ENABLED` | `false` | Enable/disable console logging via `utils/log.ts` |
| `GOOGLE_MAPS_API_KEY` | *(set in `.env`)* | Google Maps API key for Branch Search |

---

## Known Limitations

- Authentication is currently mocked (2-second delay). No real API connection yet.
- Google Maps requires a native rebuild after updating the API key in `.env`.
- Currency Exchange screen is a "Coming Soon" placeholder — no design spec yet.
- Typed routes (`typedRoutes: true`) require `as any` casts for `app/search/*` routes until Expo regenerates its route manifest.
" 
