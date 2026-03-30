---
applyTo: "**"
---

# Active Context

## Status Saat Ini

127 unit test lolos (27 Maret 2026). Profile Edit selesai (real API GET/PUT). Dashboard Home dengan floating navbar & stacked cards. Search feature unit tests lengkap.

## Fokus Kerja Saat Ini

- Auth backend (MSW/API) ditunda ke fase berikutnya
- Auth session restoration (cold-start) ditunda
- Kandidat fitur berikutnya: Payout Status Polling, Saved Beneficiaries, Screenshot Warning UI

## Keputusan Aktif

### Arsitektur

- Feature-first layout: `app/` = thin routing layer, logic di `features/`
- `usePayoutFlow` = single orchestration hook untuk payout journey
- Custom native Expo module (`expo-screen-security`) — no third-party biometric lib

### Konvensi Kode

- Uang selalu **minor unit** di API/state; konversi di `utils/money.ts` untuk tampilan
- IBAN dinormalisasi (uppercase, tanpa spasi) sebelum submit
- Error class hierarchy di `core/api/errors.ts` — jangan string error
- `Pressable` over `TouchableOpacity` — project standard
- `ThemedText`/`ThemedView` dari `components/ui/` untuk dark mode
- User-facing text via i18n (`useTranslation` hook)

### Pola Testing

- Unit test untuk logic murni dan component render
- MSW untuk integration test API (global via `jest.setup.js`)
- Maestro untuk E2E flow

## Referensi Skill

- **Feature-specific patterns** (auth, dashboard, profile, modal, filter, payout): invoke `#implementation-patterns`
- **Scaffolding fitur baru**: invoke `#feature-scaffold`
- **Riwayat keputusan & fitur selesai**: invoke `#project-history`
- **Menulis unit test**: invoke `#unit-test`
