---
applyTo: "**"
---

# Progress

## Status Keseluruhan

**IMPLEMENTED + UI POLISH + PROFILE EDIT + SEARCH TESTS** — 127 unit test lolos (27 Mar 2026).

## Fitur yang Sudah Selesai

- **Core**: Expo Router, TanStack Query, MSW, API client, error hierarchy, i18n (EN+ID), theme (dark/light)
- **Auth**: Local dummy sign-in/sign-up via AsyncStorage, seed demo accounts, i18n
- **Dashboard Home**: DashboardHeader (gradient, avatar, notif), stacked card carousel, FeatureMenuGrid, FloatingTabBar, privilege-based menu, useFocusEffect refresh
- **Profile Edit**: Real API GET/PUT, form pre-fill (hasPopulated ref), snapshot revert-on-failure, profile image, displayName local state
- **Merchant Dashboard**: Balance display, infinite scroll activity, detail modal, date filter (server-side), filter chips
- **Payout**: Form (RHF + IBAN/amount validation), confirm modal, result modal, usePayoutFlow orchestration, biometric, idempotency
- **Security**: expo-screen-security (device ID, biometric, screenshot listener)
- **Utils**: money.ts, iban.ts, date.ts
- **Testing**: 127 unit tests (API client, errors, utils, auth-service, dashboard-service, search API/hooks/components), 8 Maestro E2E flows

## Yang Belum / Perlu Dicek

- [ ] Verifikasi build Android & iOS berjalan
- [ ] Payout Status Polling — endpoint `GET /api/payouts/:id` sudah ada di mock, belum digunakan
- [ ] Saved Beneficiaries — simpan IBAN favorit via AsyncStorage
- [ ] Screenshot Warning UI — `addScreenshotListener` terpasang tapi belum ada UI feedback
- [ ] Auth session restoration — cek session lokal saat app cold-start, auto-skip sign-in
- [ ] Auth backend flow — MSW handler + endpoint sign-in/sign-up nyata

## Known Issues

- Tidak ada backend nyata — semua mock via MSW
- Biometric di Expo simulator/emulator mungkin tidak tersedia — perlu device fisik
- Web platform hanya secondary support

## Referensi Detail

- **Riwayat keputusan & detail fitur selesai**: invoke `#project-history`
