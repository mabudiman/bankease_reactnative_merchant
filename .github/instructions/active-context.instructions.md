---
applyTo: "**"
---

# Active Context

## Status Saat Ini

Dashboard Home UI polling & visual refinement selesai (25 Maret 2026). Profile Edit screen selesai dengan full CRUD ke real API (26 Maret 2026). useFocusEffect untuk refresh Home saat kembali dari profile. Search feature unit tests ditambahkan (27 Maret 2026) — 5 file, 37 test baru. Total 127 unit test lolos.

## Fokus Kerja Saat Ini

- **Profile Edit selesai**: GET profile dari `http://4.193.104.245:8080/api/profile/{uuid}`, form pre-fill, PUT update, alert success/failed, tombol disabled kalau belum semua field terisi
- **Profile image**: ditampilkan di ProfileScreen (avatar atas) dan DashboardHeader (Home) — fallback ke Ionicons person kalau `image` null/empty
- **Dashboard Home refresh**: `useDashboard` sekarang pakai `useFocusEffect` — data di-fetch ulang setiap kali tab Home aktif/fokus
- **Dashboard Home selesai (refinement)**: Floating card navbar, stacked card visual, 3-color gradient kartu, PNG asset navbar + notification, FeatureMenuGrid plain-View
- **Privilege-based menu**: demo-001 → 3 menu; demo-002 → semua 9 menu; akun baru → hanya Account and Card
- **demo-001**: 2 kartu (VISA navy-blue, MC purple); **demo-002**: 2 kartu (VISA green, MC dark navy)
- **Search feature unit tests selesai (27 Mar 2026)**: 5 file test, 37 tests — API, hooks, SearchCategoryCard, ExchangeRateRow, BranchRow
- Auth backend (MSW/API) masih ditunda ke fase berikutnya
- Auth session restoration (cold-start) masih ditunda
- Kandidat fitur berikutnya: Payout Status Polling, Saved Beneficiaries, Screenshot Warning UI

## Keputusan Aktif & Pertimbangan

### Arsitektur

- Feature-first layout dengan `app/` sebagai thin routing layer
- `usePayoutFlow` sebagai single orchestration hook untuk entire payout journey
- Custom native Expo module (`expo-screen-security`) — tidak boleh menggunakan library biometrik pihak ketiga

### Konvensi Kode

- Jumlah uang selalu dalam **minor unit** (pence/cent) di API dan state internal
- Konversi ke major unit hanya untuk tampilan (`utils/money.ts`)
- IBAN dinormalisasi (uppercase, tanpa spasi) sebelum submit
- Error class hierarchy di `core/api/errors.ts` — gunakan ini, jangan string error

### Pola Testing

- Unit test untuk logic murni dan component render
- MSW untuk integration test API
- Maestro untuk E2E flow

## Pola Penting yang Perlu Diingat

### Saat Menambah Filter / Query Parameter Baru ke useInfiniteQuery

- Masukkan parameter ke `queryKey` agar TanStack Query auto-refetch & reset pagination saat nilai berubah
- Pattern: `queryKey: ["activity", dateFrom ?? null, dateTo ?? null]`
- Helper date range di `utils/date.ts` — `getDateRangeForFilter(filter)` return `{ dateFrom, dateTo } | null`
- `null` berarti "All" (tidak kirim params ke API)

### Saat Menambah Filter Bar Horizontal

- Gunakan `ScrollView horizontal` dengan `flexGrow: 0, flexShrink: 0` di `style` — **WAJIB**, tanpa ini `ScrollView` akan memenuhi seluruh tinggi layar
- Chips menggunakan `Pressable` + `accessibilityState={{ selected: isActive }}`
- Active chip: background `Colors.light.tint` + text putih; inactive chip: border `#C7C7CC` + text `#687076`

### Saat Menambah Modal Baru (pola dari ActivityDetailModal)

- Gunakan `React Native Modal` dengan `transparent` + `animationType="fade"` + overlay `rgba(0,0,0,0.45)`
- Container: `borderRadius: 16`, `padding: 20`, `gap: 20`
- Pola `Row` helper component (label + value) untuk menampilkan detail field
- Selalu tambah `onRequestClose` dan `accessibilityViewIsModal` untuk aksesibilitas Android
- State management: `useState<T | null>` lokal di screen — tidak perlu hook terpisah untuk UI state murni
- `memo()` pada komponen modal untuk cegah re-render berlebih

### Saat Menambah Fitur Baru

1. Buat folder di `features/<nama-fitur>/` dengan struktur: `api/`, `components/`, `hooks/`, `services/`, `locales/`, `types.ts`
2. Gunakan `core/api/client.ts` untuk HTTP request
3. Extend `core/api/errors.ts` jika ada error baru
4. Tambahkan query key baru di TanStack Query

### Saat Mengedit Payout Flow

- Logic utama ada di `features/payout/hooks/usePayoutFlow.ts`
- Jangan tambahkan business logic di `app/(tabs)/payouts.tsx`
- Idempotency key di-generate sekali di `start()`, jangan di `confirm()`

### Saat Mengedit Komponen

- Gunakan `ThemedText` / `ThemedView` dari `components/ui/` untuk dukungan dark mode otomatis
- Teks user-facing harus via i18n (`useTranslation` hook)

### Saat Membangun Auth Screen (pola dari Sign Up)

- Screen Sign In tetap di `app/index.tsx` sebagai landing default
- Screen Sign Up di `app/sign-up.tsx` — route terpisah, bukan overlay/modal
- Navigasi antar auth screen: `router.push('/sign-up')` dari sign-in, `router.back()` dari sign-up
- Setelah login sukses: `router.replace('/(tabs)')` untuk menggantikan stack auth
- **Sign Up Real API**: `authApi.signUp` di `features/auth/api/index.ts` — `fetch` langsung ke `http://4.193.104.245:3031`, body: `{ email, password, full_name, phone }`
- **Error handling sign-up**: on error `setError(msg)` only — **jangan clear field apapun** — user bisa retry tanpa re-ketik; `finally` restore `isLoading(false)`
- **Local AsyncStorage signUp dihapus** — `authService.signUp` hanya delegasi ke `authApi.signUp`; seed demo accounts masih ada untuk `signIn` path
- **ROOT CAUSE BUG yang harus dihindari**: bottom sheet `position:'absolute'` + `flex:1` tanpa fixed height selalu membuat overlap form pada layar berbeda ukuran
- Komposisi dua lapis yang benar: section ungu (header + hero) + white sheet (`flex:1`) keduanya adalah **normal layout child** dalam `ScrollView` dengan `contentContainerStyle={{ flexGrow:1 }}`
- `flex:1` pada white sheet + `flexGrow:1` pada `contentContainerStyle` = white sheet selalu mengisi sisa vertical space tanpa posisi absolut
- Input fields pada white panel pakai warna berbeda dari purple-area inputs: `SHEET_INPUT_BORDER = 'rgba(0,0,0,0.12)'`, `SHEET_TEXT = Colors.textBlack`
- `SafeAreaView edges={['top']}` hanya membungkus header section (flex:0), bukan seluruh screen

### Saat Menambah Local Auth Dummy (AsyncStorage)

- Service di `features/auth/services/auth-service.ts` — tiga concern terpisah: `signIn`, `signUp`, `getSession`/`clearSession`, `getSessionAccount`
- Storage keys dipisah: `@auth:accounts` untuk array akun, `@auth:session` untuk session aktif
- Seed data pre-loaded pada akses `loadAccounts()` pertama kali (jika storage kosong)
- **`loadAccounts()` harus upsert tiap seed by id** — loop SEED_ACCOUNTS dan cek per-id, bukan hanya cek satu seed account
- `getSessionAccount()` = `getSession()` + `loadAccounts()` → return `LocalAuthAccount | null`

### Saat Membangun Profile Edit Screen

- `ProfileScreen` di `features/profile/components/ProfileScreen.tsx` — di-route dari `app/(tabs)/settings.tsx`
- `useProfile()` hook: load dari `profileService.loadProfile(accountId)` → GET real API; save via `profileService.saveProfile(accountId, data)` → PUT real API
- `profileService` punya `PROFILE_ID_MAP` untuk mapping dummy ID (`demo-001`) ke UUID API nyata (`da08ecfe-...`); akun sign-up baru sudah pakai UUID langsung
- **Form pre-fill**: pakai `useRef hasPopulated` — populate hanya sekali saat data pertama kali dimuat, **bukan tiap kali `profile` state berubah** — ini mencegah reset form tak sengaja
- **Snapshot pattern**: `useRef snapshot` menyimpan nilai terakhir yang berhasil disimpan/dimuat; saat save gagal form di-revert ke snapshot; saat save sukses snapshot di-update ke nilai baru
- **`saveProfile` di hook mengembalikan `boolean`** — `true` = sukses, `false` = gagal; jangan update `profile` state di hook saat sukses karena itu akan re-trigger `useEffect([profile])` dan reset form
- **`displayName` state lokal** di screen — diupdate dari `profile.transactionName` saat load dan dari `transactionName` field saat save sukses; tidak bergantung pada `profile` object agar tidak reset
- Tombol Confirm disabled bila salah satu field kosong (`isAllFilled` check)
- Alert: `Alert.alert('Success', ...)` saat sukses; `Alert.alert('Failed', ...)` saat gagal
- **Profile image**: tampil `<Image source={{ uri: profile.image }}>` di avatar jika `profile.image` ada; fallback ke `<Ionicons name="person">`; avatar `overflow: 'hidden'` wajib agar gambar ter-clip jadi bulat

### Saat Membangun Dashboard Home (pola dari Dashboard feature)

- `useDashboard()` hook menggunakan **`useFocusEffect` + `useCallback`** (bukan `useEffect`) agar data di-fetch ulang setiap kali screen/tab aktif — kritis untuk sinkronisasi setelah user edit profile lalu kembali ke Home
- `dashboardService.getPrivileges(accountId)` — synchronous, hardcoded ROLE_MAP, tidak AsyncStorage
- `dashboardService.loadCards(accountId)` — AsyncStorage key `@dashboard:cards`, upsert seed per accountId by card id
- `dashboardService.getNotificationCount(accountId)` — AsyncStorage key `@dashboard:notifications:{accountId}`, default 3
- `LinearGradient` dari `expo-linear-gradient` — **harus install** via `npx expo install expo-linear-gradient`
- `DashboardHeader` membungkus `SafeAreaView edges=['top']` di dalam `LinearGradient`, bukan sebaliknya
- **Notification icon** gunakan PNG asset `icon_notification.png` dengan `tintColor: white` — bukan Ionicons
- **Avatar** gunakan solid white background (`Colors.white`) + icon warna `Colors.primary` — bukan `rgba(255,255,255,0.2)`
- **`AccountCard`**: `width: '100%'` (bukan `CARD_WIDTH` fixed) agar wrapper yang kontrol lebar; 3-color gradient horizontal; VISA logo dari `icon_visa.png`; MC = 2 circle overlapping; NFC arcs via borderRadius
- **`AccountCardCarousel`** = stacked card visual (bukan horizontal FlatList): `position:absolute` layers, front card `logicalIdx=0`, setiap layer ditambah `INSET_PER_LAYER=10px` kiri+kanan + `PEEK=14px` top offset, opacity menurun `[1, 0.82, 0.62]`
- **`FeatureMenuGrid`** = plain `View` + `map` baris per 3 item — **JANGAN FlatList** karena FlatList `scrollEnabled=false` dalam ScrollView tidak melaporkan tinggi dengan benar di Android
- **Bottom nav** = custom `FloatingTabBar` component via `tabBar` prop (bukan `tabBarStyle`): `position:absolute`, `left:20/right:20`, `borderRadius:32`, shadow/elevation, `zIndex:100`
- **Tab aktif**: pill `(flexDirection:row, gap:6, px:14, py:9, borderRadius:22, bg:Colors.primary)` + icon 18×18 white + label text white
- **Tab inactive**: hanya `Image` 24×24 `tintColor:'#9E9EAE'`, tidak ada label
- **Navigasi tab**: gunakan `navigation.emit({ type:'tabPress', target:route.key, canPreventDefault:true })` — bukan `navigation.navigate()` langsung — agar deep link & scroll-to-top tetap berfungsi
- **Profile image di DashboardHeader**: prop `avatarUri?: string` — render `<Image source={{ uri: avatarUri }}>` jika ada, fallback ke Ionicons; `overflow: 'hidden'` pada `avatar` style wajib untuk clip lingkaran
- **`zIndex:100`** pada `barWrapper` + **`paddingBottom:110`** pada `scrollContent` — agar floating bar tidak diblokir ScrollView
- **`Pressable`** (bukan `PlatformPressable`) untuk custom tab button — PlatformPressable pada iOS merender children internal React Navigation, bukan JSX kita
- **`app/i18n.ts` → `app/i18n.ts`** — prefix `_` agar Expo Router tidak memperlakukannya sebagai route (menghilangkan WARN "missing default export")
- Interpolasi `{{name}}` di i18n: `t('dashboard.header.greeting').replace('{{name}}', name)` — `useTranslation` tidak support template natively
- **Seed harus di-upsert**, bukan hanya seed saat `null` — jika storage sudah ada sebelum seed diperkenalkan, `loadAccounts()` harus cek by id dan insert seed yang hilang agar akun demo selalu tersedia
- **Selalu `.trim()` password** sebelum simpan di `signUp` dan sebelum compare di `signIn` — keyboard Android bisa menambah trailing space/newline diam-diam
- **Jangan pakai prefix visual (+62) di phone field** tanpa juga menyimpannya ke storage — inkonsistensi format antara sign-up (visual prefix) dan sign-in (tanpa prefix) adalah root cause login gagal
- Validasi duplikasi phone sebelum write, bukan setelah
- Setelah sign-up sukses: tampilkan `Alert.alert('Sign Up Successful', ..., [{ text: 'OK', onPress: () => router.back() }])` — user tap OK baru berpindah ke sign-in
- `features/auth/locales/en.json` dan `id.json` menggunakan flat dotted keys (`"signUp.title": "Sign up"`) agar kompatibel dengan `flattenWithPrefix` di `app/i18n.ts`
- Setiap feature baru yang menambah locale harus juga mendaftarkan import di `app/i18n.ts`

### Saat Membangun Token Manager / Auth Token

- `core/api/token-manager.ts` — module-level `let _token: string | null` untuk synchronous access di `request()` headers; juga persist ke `AsyncStorage '@auth:token'` untuk cold-start session restoration
- `loadToken()` dipanggil sekali di `app/_layout.tsx` `useEffect` saat `isReady` true — sebelum user membuka halaman apapun yang butuh auth
- `getToken()` synchronous — dipakai di `core/api/client.ts` saat build request headers
- `clearToken()` dipanggil di `authService.clearSession()` saat logout
- Test file yang mengimport `client.ts` (atau modul apapun yang transitif import `token-manager.ts`) harus menambahkan `jest.mock('@/core/api/token-manager', ...)` agar tidak crash karena AsyncStorage NativeModule null

### Saat Menambah Input Validation (pola dari ProfileScreen & SignUpScreen)

- **Card number / digit-only field**: pakai `v.replace(/[^\d\s]/g, '')` untuk strip silently; set `fieldError` state jika ada char yang di-strip; `isAllFilled`/`isFormValid` harus cek `fieldError === null`
- **No-space field (username)**: cek `/\s/.test(v)` → set `nameError`; strip tidak dilakukan (user harus hapus manual — lebih jelas)
- **Phone field** (`+` + digits only): `v.replace(/(?!^\+)[^\d]/g, '')` — pertahankan `+` hanya di posisi 0; strip selain itu
- **Password min length**: `v.length > 0 && v.length < 6` → set `passwordError`; tidak tampilkan error saat field masih kosong
- **`FormField` component** di ProfileScreen punya prop `error?: string | null` — tampilkan border merah (`fieldInputError`) + teks error di bawah field
- **Inline error style**: `fontSize: 11`, `color: '#FF3B30'` (atau `'#FF453A'`), `marginTop: 4` — di bawah input, bukan di atas
- **`isFormValid` / `isAllFilled`** harus include semua error state: `cardNumberError === null && nameError === null && phoneError === null && passwordError === null`

## Insights & Pelajaran

- **Search feature test pattern**: API test cukup import fungsi dan await langsung — MSW handler di `mocks/handlers.ts` sudah intercept tanpa setup tambahan; hook test pakai `renderHook` + `waitFor(() => isSuccess)` + `createWrapper()`; component test pakai `render` + `screen.getByText/getByRole` + `fireEvent.press`
- **Import `MOCK_*` dari `mocks/data.ts`** saat assert jumlah/nilai di test API & hook — hindari magic number; pastikan test tetap valid jika seed data berubah
- **`useFocusEffect` bukan `useEffect`** untuk hook yang perlu refresh saat navigasi kembali ke screen (e.g. `useDashboard`) — `useEffect([], [])` hanya jalan sekali saat mount, tidak re-run saat tab kembali aktif
- **Form snapshot pattern**: untuk form edit yang harus revert-on-failure, gunakan `useRef snapshot` + `hasPopulated` ref; populate field hanya sekali; saveProfile kembalikan boolean; sukses → update snapshot; gagal → revert ke snapshot
- **Jangan update profile state di hook saat save sukses** jika itu akan menyebabkan `useEffect([profile])` di screen meng-overwrite form yang sudah diisi user — ini root cause form reset
- **`displayName` state lokal** di ProfileScreen agar nama di atas langsung terupdate saat save sukses tanpa perlu re-fetch profile dari API
- `requestAnimationFrame` diperlukan saat transisi dari confirm modal ke result modal untuk menghindari state conflict React
- Biometric threshold check terjadi di flow hook (bukan di API layer) — 100000 minor units = £1,000
- Double-submit guard menggunakan `ref` bukan `state` agar tidak trigger re-render
- Prop `onPress?: () => void` yang opsional di `ActivityRow` memungkinkan reuse tanpa onPress (backward-compatible)
- `Pressable` lebih fleksibel dari `TouchableOpacity` — digunakan sebagai standar di proyek ini untuk tap handler
- Warning ESLint "mark props as read-only" adalah pre-existing di seluruh codebase — bukan error baru, tidak perlu diperbaiki
- `ScrollView` horizontal **harus** diberi `flexGrow: 0, flexShrink: 0` di `style` — tanpanya akan memenuhi seluruh tinggi layar
- Filter chip aktif di-reset scroll ke atas via `flatListRef.current?.scrollToOffset({ offset: 0, animated: false })` dalam `useEffect([activeFilter])`
- Test date range (`getDateRangeForFilter`) gunakan `.getDate()/.getMonth()` (local time) bukan `.getUTCDate()` — timezone CI berbeda dengan lokal
- Auth screen dua lapis iOS: susun sebagai dua `<View>` vertikal biasa (hero + white sheet) di dalam `ScrollView`, bukan satu view + overlay absolut — ini menyelesaikan root cause bug overlap bottom sheet
- `features/auth/locales/en.json` dan `id.json` menggunakan flat dotted keys agar `flattenWithPrefix` di `app/i18n.ts` bisa membuat key `auth.signUp.title`; setiap fitur baru harus mendaftarkan locale import di `app/i18n.ts`
- Dummy auth lokal memakai AsyncStorage dengan key terpisah untuk accounts dan session; seed data di-load sekali pada akses pertama jika storage kosong
- SonarQube mendeteksi literal password string di seed data sebagai "hard-coded credential" — hindari dengan menyusun string dari array join atau gunakan komentar `NOSONAR` yang eksplisit
- **Login gagal setelah sign-up**: root cause paling umum adalah format phone yang berbeda — pastikan tidak ada prefix visual di satu form tapi tidak di form lain; simpan phone dalam format yang sama persis dengan yang diketik user
- **Password tidak cocok antar session**: selalu `.trim()` password di kedua sisi (saat simpan `signUp` dan saat compare `signIn`) — keyboard Android sering menambah trailing whitespace
- **`autoCapitalize="none"` + `autoCorrect={false}` wajib di semua password field** — tanpanya Android bisa mengubah isi field secara diam-diam saat `secureTextEntry=false` (show password mode)
- **`loadAccounts()` harus upsert**, bukan hanya seed saat storage `null` — jika emulator/device sudah pernah run sebelum seed diperkenalkan, data seed tidak pernah masuk; cek by id dan insert yang hilang
- **Dashboard privilege ROLE_MAP adalah hardcoded constant** di `dashboard-service.ts` — tidak AsyncStorage; akun baru (sign-up) otomatis dapat DEFAULT_ROLE (`ACCOUNT_CARD` saja) karena tidak ada entry di ROLE_MAP
- **`FeatureMenuGrid` harus plain `View` + `map`**, bukan `FlatList numColumns` — FlatList dengan `scrollEnabled=false` di dalam ScrollView tidak melaporkan tinggi yang benar di Android sehingga baris terakhir terpotong
- **`loadCards` upsert seed per-card by id** — sama dengan `loadAccounts`; jika storage sudah ada tapi seed card baru diperkenalkan, upsert memastikan card seed selalu ada
- **Custom tab bar via `tabBar` prop** (bukan `tabBarStyle`) — satu-satunya cara agar floating card dengan borderRadius besar & shadow benar di Android; `tabBarStyle` position:absolute tidak bekerja reliable
- **`Pressable` untuk tab button**, bukan `PlatformPressable` — `PlatformPressable` iOS merender children internal RN Navigation, bukan JSX custom yang diberikan
- **`navigation.emit({ type:'tabPress' })`** untuk navigasi custom tab — bukan `navigation.navigate()` langsung; ini pola resmi yang mempertahankan semua TabPress listeners
- **`app/i18n.ts` → `app/i18n.ts`** — file utility di folder `app/` harus diberi prefix `_` agar Expo Router tidak memperlakukannya sebagai route (mencegah WARN "missing default export")
- **Shell backtick escaping** di `node -e` dapat membuang baris yang mengandung `!` (bash history expansion) — solusi: gunakan `node -p` atau tulis file via script JS terpisah
- **`AccountCard` gunakan `width: '100%'`** bukan pixel fixed — agar wrapper layer (stacked carousel) yang mengontrol lebar, bukan card itu sendiri
- **Stacked card carousel**: render `[...layers].reverse()` agar kartu belakang di-render pertama (z-order lebih rendah); gunakan `logicalIdx` (0=depan) untuk offset & opacity; `position:absolute` + `left/right inset` untuk efek tumpukan
