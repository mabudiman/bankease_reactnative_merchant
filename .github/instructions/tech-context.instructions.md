---
applyTo: '**'
---

# Tech Context

## Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework | Expo | ~54.0.32 |
| Runtime | React Native | 0.81.5 |
| UI Library | React | 19.1.0 |
| Language | TypeScript | ~5.9.2 |
| Navigation | Expo Router (file-based) | ~6.0.22 |
| Server State | TanStack Query (React Query) | ^5.90.20 |
| Form | React Hook Form | ^7.71.1 |
| Mocking | MSW (Mock Service Worker) | ^2.12.9 |
| Testing (Unit) | Jest + @testing-library/react-native | ^29.7.0 |
| Testing (E2E) | Maestro | (CLI tool) |
| UUID | expo-crypto | ~15.0.8 |
| Storage | @react-native-async-storage/async-storage | ^2.2.0 |

## Cara Menjalankan

```bash
# Install dependencies
npm i

# Jalankan di iOS
npx expo run:ios

# Jalankan di Android
npx expo run:android

# Unit tests
npm test -- --verbose

# Watch mode
npm run test:watch

# E2E tests
maestro test e2e/
```

## Struktur Konfigurasi

| File | Keterangan |
|------|------------|
| `app.json` | Expo config (nama, slug, icon, scheme) |
| `tsconfig.json` | TypeScript config dengan path alias `@/` |
| `jest.config.js` | Jest config dengan `jest-expo` preset |
| `jest.setup.js` | Setup MSW server untuk test environment |
| `eslint.config.js` | ESLint dengan `eslint-config-expo` |

## Path Aliases
- `@/` → root project (dikonfigurasi via tsconfig.json)
- Contoh: `import { formatMoney } from '@/utils/money'`

## Native Module
- Local Expo module: `modules/expo-screen-security`
- Workspace npm package (via `"workspaces": ["modules/*"]`)
- Platforms: Android (Kotlin), iOS (Swift)
- Tidak ada dependency biometrik pihak ketiga

## Environment & Mocking
- Backend: MSW di `http://localhost:3000`
- Mock data di `mocks/data.ts`
- Mock handlers di `mocks/handlers.ts`
- Server config Node (test): `mocks/server.node.ts`
- Server config native/web: `mocks/server.ts`

## Dependency Key

### Production
- `expo-crypto` — UUID generation (idempotency key)
- `react-hook-form` — Form state & validation
- `@tanstack/react-query` — Server state management
- `expo-router` — File-based navigation
- `@react-native-async-storage/async-storage` — Persistent storage

### Dev/Test
- `msw` — API mocking
- `jest-expo` — Jest preset untuk Expo
- `@testing-library/react-native` — Component testing utilities

## Konstanta Penting
- Biometric threshold: `£1,000` (100000 minor units)
- API timeout: 10,000 ms (10 detik)
- Activity page size: 15 items per page
- Warna positif: `#34C759` (hijau)
- Warna negatif: `#FF3B30` (merah)