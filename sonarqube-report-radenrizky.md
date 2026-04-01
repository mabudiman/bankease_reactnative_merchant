# SonarQube Report — radenrizky

**Project:** bankease-reactnative-merchant
**SonarQube Host:** https://sonarqube.4.194.42.173.sslip.io
**Author Filter:** `radenrizky27@gmail.com`

---

## Riwayat Versi

| Versi | Tanggal Scan  | Issues OPEN | Status                       |
| ----- | ------------- | ----------- | ---------------------------- |
| V2    | 1 April 2026  | 0           | ✅ 1 issue ditemukan & difix |
| V1    | 31 Maret 2026 | 0           | ✅ Semua issues sudah difix  |

---

## V2 — Scan 1 April 2026

**Tanggal Scan:** 1 April 2026
**SCM Revision:** `36be22b` (branch: `kiky`)
**Total Issues by radenrizky:** 5 (1 OPEN → difix, 4 CLOSED)
**Status:** ✅ Issue ditemukan dan langsung difix

### Ringkasan V2

| Severity  | Ditemukan | Difix |
| --------- | --------- | ----- |
| 🟡 MINOR  | 1         | 1     |
| **Total** | **1**     | **1** |

### Issues OPEN (Ditemukan & Difix)

| #   | File                                | Line | Rule  | Severity | Fix                                                                       |
| --- | ----------------------------------- | ---- | ----- | -------- | ------------------------------------------------------------------------- |
| 1   | `features/profile/profileEvents.ts` | L22  | S7728 | 🟡 MINOR | `listeners.forEach(fn => fn())` → `for (const fn of listeners) { fn(); }` |

### Issues CLOSED by radenrizky (tetap resolved dari V1)

| #   | File                                          | Line | Rule  | Fix                                         |
| --- | --------------------------------------------- | ---- | ----- | ------------------------------------------- |
| 1   | `features/auth/api/index.ts`                  | L2   | S7787 | `export {}` dihapus, file punya real export |
| 2   | `core/api/token-manager.ts`                   | L14  | S7735 | Negated condition dibalik ke positif        |
| 3   | `features/auth/components/sign-up-screen.tsx` | L84  | S7735 | Negated condition dibalik ke positif        |
| 4   | `features/auth/components/sign-up-screen.tsx` | L81  | S7781 | `replace()` → `replaceAll()`                |

### Status Uncommitted Changes

Branch `kiky` — **working tree clean**, tidak ada perubahan uncommitted.
Sumber issue baru: commit `03748fe` (1 Apr 2026) — auth username field + terkait profileEvents belum di-scan sebelumnya.

---

## V1 — Scan 31 Maret 2026

**Tanggal Scan:** 31 Maret 2026
**Total Issues:** 19 → **0** (semua sudah difix)
**Status:** ✅ Semua issues sudah difix

---

## Ringkasan

| Severity  | Sebelum | Sesudah |
| --------- | ------- | ------- |
| 🔴 MAJOR  | 3       | 0       |
| 🟡 MINOR  | 16      | 0       |
| **Total** | **19**  | **0**   |

---

## Issues OPEN (Masih Ada)

Tidak ada — semua sudah difix.

---

## Issues yang Sudah Difix (19 issues)

| #   | File                                                                              | Rule         | Fix                                                                          |
| --- | --------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------- |
| 1   | `app/(tabs)/messages.tsx` L36, L38                                                | S3358        | Nested ternary — sudah clean setelah refactor                                |
| 2   | `app/(tabs)/_layout.tsx` L90                                                      | S6478        | Component definition dipindah ke luar parent                                 |
| 3   | `app/(tabs)/_layout.tsx` L34                                                      | S6759        | Props → `Readonly<BottomTabBarProps>`                                        |
| 4   | `app/(tabs)/_layout.tsx` L123                                                     | S7748        | `0.10` → `0.1`                                                               |
| 5   | `core/api/client.ts` L60                                                          | S7744        | `?? {}` dan `: {}` dihapus                                                   |
| 6   | `features/auth/api/index.ts` L2                                                   | S7787        | File sudah punya export nyata (`authApi`)                                    |
| 7   | `features/auth/hooks/index.ts` L2                                                 | S7787        | `export {}` dihapus                                                          |
| 8   | `features/profile/components/ProfileScreen.tsx` L38                               | S6759        | `FieldProps` semua field → `readonly`                                        |
| 9   | `components/ui/icon-symbol.tsx` L40                                               | S6759        | Props → `readonly`                                                           |
| 10  | `components/ui/icon-symbol.tsx` L50                                               | S6767        | Prop `weight` + import `SymbolWeight` dihapus                                |
| 11  | `features/dashboard/components/AccountCard.tsx` L18, L31                          | S6759        | Props → `readonly`                                                           |
| 12  | `features/dashboard/components/AccountCardCarousel.tsx` L15                       | S6759        | Props → `readonly`                                                           |
| 13  | `features/dashboard/components/DashboardHeader.tsx` L18                           | S6759        | Props → `readonly`                                                           |
| 14  | `features/dashboard/components/FeatureMenuGrid.tsx` L10                           | S6759        | Props → `readonly`                                                           |
| 15  | `features/dashboard/components/MenuGridItem.tsx` L12                              | S6759        | Props → `readonly`                                                           |
| 16  | `core/api/token-manager.ts` L14                                                   | S7735        | Negated condition dibalik ke positif                                         |
| 17  | `features/auth/components/sign-up-screen.tsx` L81, L84                            | S7781, S7735 | `replace()` → `replaceAll()`, negated condition dibalik                      |
| 18  | `components/form/choose-amount.tsx` L2–3                                          | —            | Duplicate import `react-native` — merge menjadi satu import                  |
| 19  | `features/withdraw/components/__tests__/WithdrawScreen.test.tsx` L105, L139, L187 | S6478        | `fillFormWithPreset`, `selectOther`, `fillAndVerify` dipindah ke outer scope |

---

## Fitur Baru — File Withdraw (31 Mar 2026)

File-file berikut ditambahkan sebagai bagian dari fitur **Withdraw** dan sudah clean (no issues):

| File                                                             | Status                     |
| ---------------------------------------------------------------- | -------------------------- |
| `components/form/account-selection-modal.tsx`                    | ✅ Clean                   |
| `components/form/choose-account-field.tsx`                       | ✅ Clean                   |
| `components/form/choose-amount.tsx`                              | ✅ Clean (setelah fix #18) |
| `components/form/index.ts`                                       | ✅ Clean                   |
| `components/ui/primary-button.tsx`                               | ✅ Clean                   |
| `features/withdraw/types.ts`                                     | ✅ Clean                   |
| `features/withdraw/utils.ts`                                     | ✅ Clean                   |
| `features/withdraw/components/WithdrawScreen.tsx`                | ✅ Clean                   |
| `features/withdraw/components/index.ts`                          | ✅ Clean                   |
| `components/form/__tests__/AccountSelectionModal.test.tsx`       | ✅ Clean                   |
| `components/form/__tests__/ChooseAccountField.test.tsx`          | ✅ Clean                   |
| `components/form/__tests__/ChooseAmount.test.tsx`                | ✅ Clean                   |
| `components/ui/__tests__/PrimaryButton.test.tsx`                 | ✅ Clean                   |
| `features/withdraw/__tests__/withdraw-utils.test.ts`             | ✅ Clean                   |
| `features/withdraw/components/__tests__/WithdrawScreen.test.tsx` | ✅ Clean (setelah fix #19) |
