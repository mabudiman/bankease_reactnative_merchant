---
applyTo: '**'
---

# System Patterns

## Arsitektur Tingkat Tinggi

### Feature-First Layout
```
app/                    # Expo Router: routes dan layout saja (thin layer)
core/                   # Cross-cutting: API client, error types, security
features/               # Domain slices terpisah
  merchant/             # Balance, activity, infinite scroll
  payout/               # Form, confirm, result, flow orchestration, idempotency
components/             # Shared UI (feedback, ui primitives)
utils/                  # Pure utility functions (money, date, iban)
constants/              # Theme dan shared constants
hooks/                  # Shared React hooks
mocks/                  # MSW mock handlers dan data
modules/                # Custom Expo native module
test-utils/             # Shared test helpers
```

### Prinsip Desain
- **Thin app layer**: `app/` hanya routing dan layout. Tidak ada business logic di route files.
- **Feature ownership**: Setiap feature memiliki `api/`, `components/`, `hooks/`, `services/`, `locales/`, `types.ts` sendiri.
- **Core untuk shared infra**: `core/` untuk HTTP client, domain errors, security — digunakan lebih dari satu feature.

---

## Pola-Pola Utama

### 1. Server State: TanStack Query (React Query)
- `useMerchant()` dan `useActivityInfinite()` untuk data read-only dengan caching otomatis
- `useCreatePayout()` sebagai mutation — on success invalidates `["merchant"]` dan `["activity"]`
- Query keys: `["merchant"]`, `["activity"]` — explicit dan mudah di-invalidate
- Tidak ada global store (Redux/Zustand) karena scope read-heavy + satu mutation

### 2. Payout Flow Orchestration: `usePayoutFlow`
Hook tunggal yang mengatur seluruh alur payout:
```
form → start(payout) → confirm modal → confirm() → biometric? → API → outcome
```
**Responsibilities:**
- Menyimpan `pendingPayout` (dengan idempotency key) dan `outcome`
- Generate idempotency key UUID sekali saat `start()`, reuse pada retry
- Guard double-submit via `isAlreadyProcessingRef`
- Panggil device ID, biometric (jika > threshold), lalu mutate
- Map outcome: clear pending jika non-recoverable, keep untuk recoverable
- `requestAnimationFrame` saat update outcome (cegah state conflict antara confirm modal dan result modal)

### 3. Error Hierarchy
`core/api/errors.ts` mendefinisikan:
```
ApiError (base)
├── InsufficientFundsError   (recoverable: false, HTTP 400)
├── ServiceUnavailableError  (recoverable: true,  HTTP 503)
├── NetworkError             (recoverable: true)
├── BiometricCancelledError  (recoverable: true)
└── BiometricUnavailableError(recoverable: false)
```
- Flag `recoverable` menentukan apakah UI menampilkan "Try Again" atau hanya "Close"
- `mapErrorMessage()` di feature payout memetakan error ke user-friendly message

### 4. Idempotency
- Client-generated UUID via `expo-crypto` saat user pertama confirm
- Key disimpan dalam `pendingPayout` — reused pada setiap retry
- Dikirim sebagai header `Idempotency-Key` ke API

### 5. API Layer (3 lapisan)
```
core/api/client.ts          ← Generic request() dengan timeout, JSON headers, error parsing
features/X/api/X-api.ts     ← Feature-specific endpoint + header (e.g., Idempotency-Key)
features/X/services/Xservice.ts ← Typed wrapper; digunakan oleh hooks; mockable di tests
```

### 6. Form: React Hook Form
- `PayoutForm` menggunakan `Controller` untuk setiap field
- Validasi inline (required, numeric, IBAN format)
- `forwardRef` + `useImperativeHandle` untuk expose `reset()` ke parent
- Amount dikonversi ke minor unit sebelum `onSubmit`

### 7. Native Module: `expo-screen-security`
Custom Expo module di `modules/expo-screen-security/`:
- **`getDeviceId()`** — Device fingerprint unik
- **`authenticateWithBiometrics(reason)`** — FaceID/TouchID/Fingerprint
- **`addScreenshotListener(callback)`** — Event listener deteksi screenshot
- Bridge JS di `core/security/screenSecurity.native.ts`
- Error native dipetakan ke `ApiError` hierarchy di `core/security/enforceBiometrics.ts`

---

## Komponen Kunci

### Feature Merchant
| File | Tanggung Jawab |
|------|----------------|
| `features/merchant/api/merchantApi.ts` | GET /merchant, GET /activity |
| `features/merchant/services/merchantService.ts` | Typed wrapper |
| `features/merchant/hooks/useMerchant.ts` | React Query query |
| `features/merchant/hooks/useActivityInfinite.ts` | Infinite scroll query |
| `features/merchant/components/HomeCard` | Tampilan saldo |
| `features/merchant/components/ActivityRow` | Item transaksi |
| `features/merchant/components/ActivityPreview` | Preview 15 transaksi |

### Feature Payout
| File | Tanggung Jawab |
|------|----------------|
| `features/payout/api/payoutApi.ts` | POST /payouts |
| `features/payout/services/payoutService.ts` | Typed wrapper + idempotency |
| `features/payout/hooks/useCreatePayout.ts` | React Query mutation |
| `features/payout/hooks/usePayoutFlow.ts` | **Orchestration hook (core logic)** |
| `features/payout/components/PayoutForm` | Form input (RHF) |
| `features/payout/components/PayoutConfirmModal` | Confirm sebelum kirim |
| `features/payout/components/PayoutResultModal` | Success/error result |
| `features/payout/utils/mapErrorMessage.ts` | Error → user message |

---

## Data Flow

### Merchant/Activity
```
Screen → useMerchant()/useActivityInfinite() → service → request() → MSW mock
```

### Payout
```
User submit form
  → usePayoutFlow.start(payout)     [generate idempotency key, store pendingPayout]
  → Confirm modal tampil
  → usePayoutFlow.confirm()
     → getDeviceId()
     → authenticateWithBiometrics() [jika amount > £1,000]
     → useCreatePayout.mutateAsync({body, idempotencyKey})
     → Success: clear pending, set outcome.success, invalidate queries
     → Error recov: keep pending, set outcome.error (retry akan pakai key sama)
     → Error non-recov: clear pending, set outcome.error
```

---

## Testing Patterns
- **Unit tests**: Jest + `@testing-library/react-native`
- **E2E tests**: Maestro (`e2e/*.yaml`)
- **MSW**: Mock API di development dan beberapa integration tests
- `test-utils/createWrapper.tsx` — QueryClientProvider wrapper untuk component tests
- Mock biometric/device ID via Jest mocks di `__mocks__/`