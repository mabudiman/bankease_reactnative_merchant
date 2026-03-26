---
applyTo: '**'
---

# Progress

## Status Keseluruhan
**IMPLEMENTED + UI POLISH + PROFILE EDIT** — Semua fitur utama + visual refinement selesai. Profile Edit screen dengan real API (GET/PUT), profile image di Home & Profile. useFocusEffect untuk auto-refresh Home. 90 unit test lolos.

---

## Yang Sudah Berjalan ✅

### Core Infrastructure
- [x] Expo Router setup dengan tab navigation (Home + Payouts)
- [x] TanStack Query setup dengan `QueryClientProvider`
- [x] MSW mock server untuk development dan testing
- [x] Core API client (`core/api/client.ts`) dengan timeout & error parsing
- [x] Error hierarchy (`core/api/errors.ts`) — 5 error types dengan `recoverable` flag
- [x] i18n system (`core/i18n/`) — English + Español
- [x] Theme system dengan dark/light mode support

### Feature: Auth (Local Dummy)
- [x] `SignInScreen` — screen sign-in, navigasi ke sign-up, local dummy login via AsyncStorage
- [x] `SignUpScreen` — screen sign-up baru, layout iOS dua lapis, route `app/sign-up.tsx`
- [x] `authService` — `features/auth/services/auth-service.ts`, AsyncStorage-based signIn/signUp/getSession/clearSession/**getSessionAccount**
- [x] Seed accounts demo: demo-001 (phone `081234567890`, password `demo1234`) dan demo-002 (phone `089876543210`, password `premium1234`)
- [x] Navigasi dua arah sign-in ↔ sign-up via Expo Router
- [x] Login sukses redirect ke `/(tabs)` via `router.replace`
- [x] i18n auth keys di `features/auth/locales/en.json` + `id.json`
- [ ] Auth backend (MSW/API) — ditunda ke fase berikutnya
- [ ] Session restoration saat app cold-start — ditunda

### Feature: Dashboard Home
- [x] `DashboardHeader` — LinearGradient purple–blue, avatar (dengan profile image jika ada), sapaan personal, notification badge (AsyncStorage)
- [x] `DashboardHeader` prop `avatarUri?: string` — render profile image dari API jika tersedia, fallback Ionicons
- [x] `useDashboard()` hook — **`useFocusEffect` + `useCallback`** (bukan useEffect), auto-refresh saat navigasi kembali ke Home
- [x] `MenuGridItem` — Pressable card, Ionicons icon + label, Alert “Coming Soon” on tap
- [x] `FeatureMenuGrid` — **plain `View` + `map`** per baris (bukan FlatList), menghindari Android height bug

- [x] `dashboardService.loadCards` — AsyncStorage `@dashboard:cards`, upsert seed per accountId+cardId
- [x] `dashboardService.getPrivileges` — hardcoded ROLE_MAP: demo-001 (3 menu), demo-002 (9 menu), new accounts (1 menu: Account and Card)
- [x] `dashboardService.getNotificationCount` — AsyncStorage `@dashboard:notifications:{accountId}`, default 3
- [x] Seed cards: demo-001 (VISA navy+MC purple), demo-002 (VISA green+MC dark navy) — masing-masing 2 kartu, 3-color gradients
- [x] **Floating card navbar** via `tabBar` prop custom `FloatingTabBar`: `position:absolute`, borderRadius, shadow, active pill, PNG assets
- [x] `app/i18n.ts` → `app/i18n.ts` (prefix `_` agar tidak jadi Expo Router route)
- [x] `features/dashboard/locales/en.json` + `id.json` — flat dotted keys, registered in `app/i18n.ts`

### Feature: Profile Edit
- [x] `ProfileScreen` — `features/profile/components/ProfileScreen.tsx`, routed via `app/(tabs)/settings.tsx`
- [x] `useProfile()` hook — load & save via real API, returns `saveProfile: (data) => Promise<boolean>`
- [x] `profileApi.getProfile(uuid)` — GET `http://4.193.104.245:8080/api/profile/{uuid}`
- [x] `profileApi.updateProfile(uuid, data)` — PUT, payload: `bank, branch, name, card_number, card_provider, currency`
- [x] `profileService` — `PROFILE_ID_MAP` untuk mapping `demo-001` → API UUID; fallback ke accountId untuk akun sign-up baru
- [x] Form pre-fill saat load: `hasPopulated` ref — populate hanya sekali
- [x] Snapshot pattern: `snapshot` ref untuk revert-on-failure
- [x] Tombol Confirm disabled bila ada field kosong (`isAllFilled` check)
- [x] Alert `'Success'` / `'Failed'` sesuai hasil API
- [x] Profile image di avatar (jika `profile.image` ada), fallback Ionicons person
- [x] `displayName` state lokal — diupdate langsung saat save sukses tanpa re-fetch

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

### Testing
- [x] Unit tests untuk: API client, errors, utils, components
- [x] Unit tests: auth-service (signIn, signUp, getSession, clearSession, getSessionAccount)
- [x] Unit tests: dashboard-service (loadCards, getPrivileges, getNotificationCount)
- [x] E2E tests (Maestro): 8 flow scenarios
- [x] MSW handlers untuk semua endpoint
- [x] 90 unit test lolos (25 Mar 2026)

---

## Yang Belum / Perlu Dicek ⚠️

- [x] ~~Verifikasi semua unit test lolos~~ — 90/90 pass (25 Mar 2026)
- [ ] Verifikasi build Android & iOS berjalan
- [ ] Payout Status Polling — endpoint `GET /api/payouts/:id` sudah ada di mock, belum digunakan
- [ ] Saved Beneficiaries — simpan IBAN favorit via AsyncStorage
- [ ] Screenshot Warning UI — `addScreenshotListener` terpasang tapi belum ada UI feedback
- [ ] Auth session restoration — cek session lokal saat app cold-start, auto-skip sign-in
- [ ] Auth backend flow — MSW handler + endpoint sign-in/sign-up nyata

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
| 25 Mar 2026 | Screen sign-up dibuat sebagai route Expo Router terpisah (`app/sign-up.tsx`) | Tidak mengganggu sign-in yang sudah ada; clean navigation dengan `router.push`/`router.back` |
| 25 Mar 2026 | Dummy auth disimpan di AsyncStorage (`@auth:accounts`, `@auth:session`) | Akun hasil sign-up harus bertahan saat app di-restart |
| 25 Mar 2026 | White sheet sign-up sebagai section vertikal biasa (bukan overlay absolut) | Mengatasi root cause bug overlap bottom sheet; `flex:1` + `flexGrow:1` pada ScrollView contentContainer lebih reliable |
| 25 Mar 2026 | Setelah sign-up sukses, kembali ke sign-in (tidak auto-login) | Alur lebih eksplisit dan mudah ditest |
| 25 Mar 2026 | Locale auth pakai flat dotted keys (`"signUp.title": "..."`) | Kompatibel dengan `flattenWithPrefix` yang hanya flatten satu level |
| 25 Mar 2026 | Hapus prefix `+62` visual dari phone field sign-up | Prefix visual tanpa disimpan ke storage menyebabkan format phone berbeda antara sign-up dan sign-in → root cause login gagal |
| 25 Mar 2026 | `.trim()` password di `signUp` (saat simpan) dan `signIn` (saat compare) | Keyboard Android sering tambah trailing whitespace; tanpa trim, kredensial tidak pernah cocok |
| 25 Mar 2026 | `loadAccounts()` upsert seed by id, bukan hanya seed saat `null` | Emulator/device yang sudah run sebelum seed diperkenalkan tidak akan mendapat akun demo tanpa upsert |
| 25 Mar 2026 | Dashboard: ROLE_MAP hardcoded di `dashboard-service.ts`, tidak AsyncStorage | Privilege tidak perlu diubah runtime; simple dan testable |
| 25 Mar 2026 | Akun baru (sign-up) mendapat DEFAULT_ROLE = hanya ACCOUNT_CARD | Role assignment by id lookup; unknown id → minimal access |
| 25 Mar 2026 | `loadCards` upsert seed per-card by id | Konsisten dengan pattern `loadAccounts`; card seed baru ditambahkan tanpa hapus data user |
| 25 Mar 2026 | 4-tab bottom nav (Home/Search/Messages/Settings) menggantikan 2-tab lama | Dashboard fintech butuh nav lebih lengkap; tab Accounts dihapus karena sudah ada di menu grid |
| 25 Mar 2026 | Pill indicator di HapticTab via `accessibilityState?.selected` + absolute View | Menambah visual feedback aktif tab tanpa mengubah API bottom-tabs |
| 25 Mar 2026 | `AccountCard` gunakan `width:'100%'` bukan pixel fixed | Agar wrapper layer (stacked carousel) kontrol lebar |
| 25 Mar 2026 | Stacked card carousel (bukan horizontal FlatList) | Visual efek tumpukan kartu; `[...layers].reverse()` untuk z-order benar; position:absolute + inset/opacity per layer |
| 25 Mar 2026 | `FeatureMenuGrid` plain `View` + `map` (bukan FlatList) | FlatList `scrollEnabled=false` dalam ScrollView tidak melaporkan tinggi benar di Android — baris terakhir terpotong |
| 25 Mar 2026 | Custom `FloatingTabBar` via `tabBar` prop | `tabBarStyle` tidak support borderRadius besar + shadow reliable di Android; custom component memberikan kontrol penuh |
| 25 Mar 2026 | `Pressable` untuk tab button (bukan `PlatformPressable`) | PlatformPressable iOS merender children internal RN Navigation, bukan JSX custom kita |
| 25 Mar 2026 | `navigation.emit({ type:'tabPress' })` untuk navigasi tab | Pola resmi React Navigation; mempertahankan deep link & scroll-to-top listeners |
| 25 Mar 2026 | `app/i18n.ts` → `app/i18n.ts` | Prefix `_` agar Expo Router tidak memperlakukannya sebagai route (menghilangkan WARN) |
| 25 Mar 2026 | 3-color gradient kartu dengan arah horizontal | Efek visual lebih dalam dan modern; `start={{x:0,y:0.5}}` + `end={{x:1,y:0.5}}` |
| 26 Mar 2026 | Profile Edit screen dengan real API GET/PUT | Merchant perlu lihat & update bank, branch, name, card_number |
| 26 Mar 2026 | `profileService` PROFILE_ID_MAP: dummy ID → real UUID | Demo accounts pakai local dummy ID, API butuh UUID nyata |
| 26 Mar 2026 | `saveProfile` di hook kembalikan `boolean`, tidak update `profile` state | Update state akan re-trigger `useEffect([profile])` dan reset form — root cause form reset |
| 26 Mar 2026 | `hasPopulated` ref untuk populate form hanya sekali | Mencegah form di-overwrite saat state berubah karena alasan lain |
| 26 Mar 2026 | `snapshot` ref untuk revert-on-failure | Saat save gagal, form kembali ke last-known-good value; saat sukses, snapshot di-update |
| 26 Mar 2026 | `displayName` state lokal di ProfileScreen | Nama langsung berubah saat save sukses tanpa perlu re-fetch profile object |
| 26 Mar 2026 | `useDashboard` ganti `useEffect` → `useFocusEffect` | `useEffect([])` hanya run sekali saat mount; kembali dari profile screen tidak trigger refresh |
| 26 Mar 2026 | Profile image di `DashboardHeader` via prop `avatarUri` | Konsisten dengan ProfileScreen; fallback ke Ionicons jika null |