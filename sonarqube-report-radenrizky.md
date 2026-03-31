# SonarQube Report — radenrizky

**Project:** bankease-reactnative-merchant
**SonarQube Host:** https://sonarqube.4.194.42.173.sslip.io
**Tanggal Scan:** 31 Maret 2026 (rescan selesai pukul 05:08 UTC)
**Total Issues:** 3 → **0** (semua sudah difix lokal, menunggu rescan berikutnya)
**Status:** ✅ Semua issues sudah difix — jalankan rescan Docker untuk konfirmasi final

---

## Ringkasan

| Severity  | Sebelum | Sesudah |
| --------- | ------- | ------- |
| 🔴 MAJOR  | 3       | 0       |
| 🟡 MINOR  | 14      | 0       |
| **Total** | **17**  | **0**   |

---

## Issues OPEN (Masih Ada)

Tidak ada — semua sudah difix.

---

## Issues yang Sudah Difix (17 issues)

| #   | File                                                        | Rule         | Fix                                                     |
| --- | ----------------------------------------------------------- | ------------ | ------------------------------------------------------- |
| 1   | `app/(tabs)/messages.tsx` L36, L38                          | S3358        | Nested ternary — sudah clean setelah refactor           |
| 2   | `app/(tabs)/_layout.tsx` L90                                | S6478        | Component definition dipindah ke luar parent            |
| 3   | `app/(tabs)/_layout.tsx` L34                                | S6759        | Props → `Readonly<BottomTabBarProps>`                   |
| 4   | `app/(tabs)/_layout.tsx` L123                               | S7748        | `0.10` → `0.1`                                          |
| 5   | `core/api/client.ts` L60                                    | S7744        | `?? {}` dan `: {}` dihapus                              |
| 6   | `features/auth/api/index.ts` L2                             | S7787        | File sudah punya export nyata (`authApi`)               |
| 7   | `features/auth/hooks/index.ts` L2                           | S7787        | `export {}` dihapus                                     |
| 8   | `features/profile/components/ProfileScreen.tsx` L38         | S6759        | `FieldProps` semua field → `readonly`                   |
| 9   | `components/ui/icon-symbol.tsx` L40                         | S6759        | Props → `readonly`                                      |
| 10  | `components/ui/icon-symbol.tsx` L50                         | S6767        | Prop `weight` + import `SymbolWeight` dihapus           |
| 11  | `features/dashboard/components/AccountCard.tsx` L18, L31    | S6759        | Props → `readonly`                                      |
| 12  | `features/dashboard/components/AccountCardCarousel.tsx` L15 | S6759        | Props → `readonly`                                      |
| 13  | `features/dashboard/components/DashboardHeader.tsx` L18     | S6759        | Props → `readonly`                                      |
| 14  | `features/dashboard/components/FeatureMenuGrid.tsx` L10     | S6759        | Props → `readonly`                                      |
| 15  | `features/dashboard/components/MenuGridItem.tsx` L12        | S6759        | Props → `readonly`                                      |
| 16  | `core/api/token-manager.ts` L14                             | S7735        | Negated condition dibalik ke positif                    |
| 17  | `features/auth/components/sign-up-screen.tsx` L81, L84      | S7781, S7735 | `replace()` → `replaceAll()`, negated condition dibalik |

---

## Langkah Selanjutnya

Jalankan rescan Docker untuk konfirmasi semua 17 issues sudah resolved di SonarQube UI.
