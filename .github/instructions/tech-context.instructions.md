---
applyTo: '**'
---

# Tech Context

## Core Stack
| Layer | Technology |
|---|---|
| Framework | React Native 0.81.5 + Expo SDK 54 |
| Language | TypeScript ~5.9 (strict) |
| Routing | Expo Router ~6.0 (file-based, typed routes) |
| State / Server | @tanstack/react-query v5 |
| Forms | react-hook-form v7 |
| Styling | StyleSheet (React Native built-in) |
| Fonts | @expo-google-fonts/poppins |
| Icons | @expo/vector-icons (Ionicons) |
| Animation | react-native-reanimated v4 |
| Gestures | react-native-gesture-handler |
| Storage | @react-native-async-storage/async-storage |
| Maps | react-native-maps (requires Google Maps API key + native rebuild) |
| Mocking | MSW v2 |
| Testing | Jest 29 + jest-expo + @testing-library/react-native |

## React Native Architecture
- New Architecture enabled (`newArchEnabled: true` in app.json)
- Expo managed workflow with custom native builds (android/ folder present)
- Web output: static (`expo-web`)

## Development Commands
```bash
npx expo start          # Start dev server
npx expo run:android    # Run on Android
npx expo run:ios        # Run on iOS
npx expo start --web    # Run on Web
npm test                # Run Jest tests
npm run test:watch      # Jest watch mode
npm run typecheck       # tsc --noEmit
npm run lint            # expo lint (ESLint)
```

## TypeScript Configuration
- Path alias `@/` maps to workspace root (configured in `tsconfig.json`)
- Typed routes enabled via `experiments.typedRoutes: true`

## Testing Setup
- `jest.config.js` — preset: `jest-expo`, module name mapper for `@/`
- `jest.setup.js` — MSW node server setup, global test utilities
- `test-utils/createWrapper.tsx` — renders with QueryClient + I18nProvider
- `test-utils/createTestQueryClient.ts` — factory for isolated query clients

## Environment / Constants
- `constants/index.ts`:
  - `API_BASE_URL = "http://localhost:3000"`
  - `API_TIMEOUT_MS = 10000`
  - `LOG_ENABLED = false`

## Key Constraints
- No Redux or Zustand — keep state local or in React Query
- No class components — functional components only
- Auth is currently mocked (2-second timeout → navigate to tabs)
- MSW handlers are empty; add handlers in `mocks/handlers.ts`
- `LOG_ENABLED` defaults to `false` — use `utils/log.ts` for conditional logging
