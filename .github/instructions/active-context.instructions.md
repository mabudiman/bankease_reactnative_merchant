---
applyTo: '**'
---

# Active Context

## Status Saat Ini
Date Filter untuk Transaction List selesai diimplementasikan (17 Maret 2026). Semua 109 unit test lolos. Proyek siap untuk fitur berikutnya.

## Fokus Kerja Saat Ini
- Fitur Date Filter (quick chips: All / Today / Last 7 Days / Last 30 Days) baru saja selesai
- Kandidat fitur berikutnya: Payout Status Polling, Saved Beneficiaries

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

## Insights & Pelajaran
- `requestAnimationFrame` diperlukan saat transisi dari confirm modal ke result modal untuk menghindari state conflict React
- Biometric threshold check terjadi di flow hook (bukan di API layer) — 100000 minor units = £1,000
- Double-submit guard menggunakan `ref` bukan `state` agar tidak trigger re-render
- Prop `onPress?: () => void` yang opsional di `ActivityRow` memungkinkan reuse tanpa onPress (backward-compatible)
- `Pressable` lebih fleksibel dari `TouchableOpacity` — digunakan sebagai standar di proyek ini untuk tap handler
- Warning ESLint "mark props as read-only" adalah pre-existing di seluruh codebase — bukan error baru, tidak perlu diperbaiki
- `ScrollView` horizontal **harus** diberi `flexGrow: 0, flexShrink: 0` di `style` — tanpanya akan memenuhi seluruh tinggi layar
- Filter chip aktif di-reset scroll ke atas via `flatListRef.current?.scrollToOffset({ offset: 0, animated: false })` dalam `useEffect([activeFilter])`
- Test date range (`getDateRangeForFilter`) gunakan `.getDate()/.getMonth()` (local time) bukan `.getUTCDate()` — timezone CI berbeda dengan lokal