---
applyTo: '**'
---

# Progress

## Status Keseluruhan
**IMPLEMENTED + AUTH FLOW** — Fitur Forgot Password flow (4 layar) ditambahkan 26 Maret 2026. Sign-in screen di-refactor untuk responsivitas. i18n mendukung English + Indonesian.

---

## Yang Sudah Berjalan ✅

### Core Infrastructure
- [x] Expo Router setup dengan tab navigation (Home + Payouts)
- [x] TanStack Query setup dengan `QueryClientProvider`
- [x] MSW mock server untuk development dan testing
- [x] Core API client (`core/api/client.ts`) dengan timeout & error parsing
- [x] Error hierarchy (`core/api/errors.ts`) — 5 error types dengan `recoverable` flag
- [x] i18n system (`core/i18n/`) — English + Indonesian
- [x] Theme system dengan dark/light mode support

### Feature: Merchant Dashboard
- [x] `useMerchant()` — query saldo available & pending
- [x] `useActivityInfinite()` — infinite scroll cursor-based pagination
- [x] `HomeCard` component — tampilan saldo
- [x] `ActivityRow` component — item transaksi (tappable via `onPress` prop)
- [x] `ActivityPreview` component — preview 15 transaksi (tappable via `onPressItem` prop)
- [x] `ActivityDetailModal` component — detail transaksi (type, description, amount, currency, date, status, ID)
- [x] `ActivityFilterBar` component — quick filter chips (All / Today / Last 7 Days / Last 30 Days)
- [x] Date filter server-side — `date_from` & `date_to` params di API, reset pagination otomatis

### Feature: Payout
- [x] `PayoutForm` — form dengan RHF, validasi IBAN & amount
- [x] `PayoutConfirmModal` — konfirmasi dengan IBAN masked
- [x] `PayoutResultModal` — hasil sukses/error dengan aksi yang tepat
- [x] `usePayoutFlow` — orchestration hook (idempotency, biometric, double-submit guard)
- [x] `useCreatePayout` — React Query mutation
- [x] `mapErrorMessage()` — error ke user-friendly message

### Security
- [x] Custom native module `expo-screen-security`
- [x] `getDeviceId()` — device fingerprinting
- [x] `authenticateWithBiometrics()` — FaceID/TouchID/Fingerprint
- [x] `addScreenshotListener()` — deteksi screenshot
- [x] Biometric threshold: 100,000 minor units (£1,000)
- [x] Idempotency key: UUID via `expo-crypto`

### Utils
- [x] `utils/money.ts` — konversi minor/major unit, format currency
- [x] `utils/iban.ts` — validasi & normalisasi IBAN
- [x] `utils/date.ts` — format tanggal + `getDateRangeForFilter()` helper

### Feature: Auth (Forgot Password)
- [x] `ForgotPasswordScreen` — OTP code input + resend button
- [x] `ChangePasswordScreen` — password + confirm password dengan visibility toggle
- [x] `ChangePasswordSuccessScreen` — ilustrasi + konfirmasi sukses
- [x] Auth types: `ForgotPasswordRequest`, `VerifyOtpRequest`, `ChangePasswordRequest`
- [x] i18n locale files (en + id) terdaftar di `app/i18n.ts` dengan namespace `auth`
- [x] Route files: `app/forgot-password.tsx`, `app/change-password.tsx`, `app/change-password-success.tsx`
- [x] Sign-in screen: link "Forgot your password?" wired ke navigasi
- [x] Sign-in screen: refactor responsivitas (bottom sheet full height, auto-fit image)

### Testing
- [x] Unit tests untuk: API client, errors, utils, components
- [x] E2E tests (Maestro): 8 flow scenarios
- [x] MSW handlers untuk semua endpoint
- [x] 109 unit test lolos (17 Mar 2026)

---

## Yang Belum / Perlu Dicek ⚠️

- [x] ~~Verifikasi semua unit test lolos~~ — 109/109 pass (17 Mar 2026)
- [ ] Verifikasi build Android & iOS berjalan
- [ ] Payout Status Polling — endpoint `GET /api/payouts/:id` sudah ada di mock, belum digunakan
- [ ] Saved Beneficiaries — simpan IBAN favorit via AsyncStorage
- [ ] Screenshot Warning UI — `addScreenshotListener` terpasang tapi belum ada UI feedback
- [ ] Forgot Password — integrasi API backend (saat ini OTP/change password belum terhubung ke API nyata)
- [ ] Forgot Password — unit tests untuk 3 screen baru
- [ ] ThemedButton disabled opacity — saat custom disabled color diberikan, opacity 0.5 seharusnya tidak diterapkan

---

## Known Issues / Catatan
- Tidak ada backend nyata — semua mock via MSW
- Biometric di Expo simulator/emulator mungkin tidak tersedia — perlu device fisik
- Web platform hanya secondary support

---

## Evolusi Keputusan
| Tanggal | Keputusan | Alasan |
|---------|-----------|--------|
| Init | Feature-first folder layout | Isolasi domain, mudah scale |
| Init | TanStack Query (bukan Redux/Zustand) | App read-heavy, satu mutation utama |
| Init | Custom native module (bukan lib pihak ketiga) | Requirement proyek |
| Init | Client-generated idempotency key | No round-trip, works offline-first |
| Init | `ref` untuk double-submit guard | Tidak trigger re-render |
| 16 Mar 2026 | `useState<T \| null>` lokal untuk detail modal state | Pure UI state, tidak perlu global/hook terpisah |
| 16 Mar 2026 | `onPress` opsional di `ActivityRow` | Backward-compatible, row tetap bisa dirender tanpa handler |
| 17 Mar 2026 | Query key `["activity", dateFrom, dateTo]` untuk filter | TanStack Query reset pagination otomatis saat key berubah |
| 17 Mar 2026 | Filter dilakukan server-side (API params) | Efisien untuk data besar, tidak load semua dulu |
| 17 Mar 2026 | Quick chips bukan DatePicker | Tidak ada library date picker; UX lebih cepat untuk range umum |
| 26 Mar 2026 | Forgot password sebagai 4 layar terpisah | Sesuai desain Figma: OTP → Change Password → Success. Navigasi `router.replace` ke success agar tidak bisa back |
| 26 Mar 2026 | i18n namespace `auth` untuk locale auth | Konsisten dengan pola namespace per-feature (`common`, `account`, `auth`) |
| 26 Mar 2026 | SafeAreaView `edges={['top']}` saja di sign-in | Bottom sheet harus menjangkau ujung bawah layar tanpa gap |