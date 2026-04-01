# SonarQube Issue Report — maulana.sechan@ecomindo.com

**Project:** BankEase Merchant Dashboard  
**Project Key:** `bankease-reactnative-merchant`  
**Author Filter:** `maulana.sechan@ecomindo.com`  
**Scan Date:** 2026-04-01  
**Dashboard:** [View on SonarQube](https://sonarqube.4.194.42.173.sslip.io/project/issues?author=maulana.sechan%40ecomindo.com&issueStatuses=CONFIRMED%2COPEN&id=bankease-reactnative-merchant)

---

## Summary

| Metric           | Count  |
| ---------------- | ------ |
| **Total Issues** | 13     |
| Total Effort     | 51 min |

### By Severity

| Severity    | Count |
| ----------- | ----- |
| 🔴 CRITICAL | 1     |
| 🟠 MAJOR    | 1     |
| 🟡 MINOR    | 11    |

### By Type

| Type          | Count |
| ------------- | ----- |
| 🐛 BUG        | 1     |
| 🔧 CODE_SMELL | 12    |

---

## Issues by File

### 1. `app/search/exchange.tsx` — 5 issues

| #   | Line                                                                                                                                                              | Severity | Type       | Message                                       | Effort | Tags                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | --------------------------------------------- | ------ | --------------------- |
| 1   | [L20](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=app/search/exchange.tsx) | 🟡 MINOR | CODE_SMELL | Prefer `Number.parseFloat` over `parseFloat`. | 2 min  | `convention` `es2015` |
| 2   | [L21](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=app/search/exchange.tsx) | 🟡 MINOR | CODE_SMELL | Prefer `Number.isNaN` over `isNaN`.           | 2 min  | `convention` `es2015` |
| 3   | [L34](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=app/search/exchange.tsx) | 🟡 MINOR | CODE_SMELL | Prefer `Number.parseFloat` over `parseFloat`. | 2 min  | `convention` `es2015` |
| 4   | [L36](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=app/search/exchange.tsx) | 🟡 MINOR | CODE_SMELL | Prefer `Number.isNaN` over `isNaN`.           | 2 min  | `convention` `es2015` |
| 5   | [L39](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=app/search/exchange.tsx) | 🟡 MINOR | CODE_SMELL | Prefer `Number.parseFloat` over `parseFloat`. | 2 min  | `convention` `es2015` |

> **Rule:** `typescript:S7773` — Use the `Number.*` versions of global `parseFloat`, `parseInt`, `isNaN`, `isFinite` for clarity and consistency (ES2015+).

---

### 2. `components/ui/input-with-selector.tsx` — 2 issues

| #   | Line                                                                                                                                                                            | Severity | Type       | Message                                              | Effort | Tags                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | ---------------------------------------------------- | ------ | ------------------------ |
| 6   | [L34](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=components/ui/input-with-selector.tsx) | 🟡 MINOR | CODE_SMELL | Mark the props of the component as read-only.        | 5 min  | `type-dependent` `react` |
| 7   | [L46](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=components/ui/input-with-selector.tsx) | 🟠 MAJOR | CODE_SMELL | Remove this useless assignment to variable `anchor`. | 1 min  | `cwe` `unused`           |

> **Rule S6759:** React component props should be `Readonly<>` to prevent accidental mutation.  
> **Rule S1854:** Assignment to variable `anchor` is never used after the assignment — dead code.

---

### 3. `components/ui/labeled-input.tsx` — 1 issue

| #   | Line                                                                                                                                                                      | Severity | Type       | Message                                       | Effort | Tags                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | --------------------------------------------- | ------ | ------------------------ |
| 8   | [L25](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=components/ui/labeled-input.tsx) | 🟡 MINOR | CODE_SMELL | Mark the props of the component as read-only. | 5 min  | `type-dependent` `react` |

> **Rule:** `typescript:S6759` — React component props should be `Readonly<>`.

---

### 4. `components/ui/modal-popover.tsx` — 1 issue

| #   | Line                                                                                                                                                                      | Severity | Type       | Message                                       | Effort | Tags                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | --------------------------------------------- | ------ | ------------------------ |
| 9   | [L24](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=components/ui/modal-popover.tsx) | 🟡 MINOR | CODE_SMELL | Mark the props of the component as read-only. | 5 min  | `type-dependent` `react` |

> **Rule:** `typescript:S6759` — React component props should be `Readonly<>`.

---

### 5. `components/ui/screen-header.tsx` — 1 issue

| #   | Line                                                                                                                                                                      | Severity | Type       | Message                                       | Effort | Tags                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | --------------------------------------------- | ------ | ------------------------ |
| 10  | [L13](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=components/ui/screen-header.tsx) | 🟡 MINOR | CODE_SMELL | Mark the props of the component as read-only. | 5 min  | `type-dependent` `react` |

> **Rule:** `typescript:S6759` — React component props should be `Readonly<>`.

---

### 6. `features/search/components/ExchangeFormCard.tsx` — 1 issue

| #   | Line                                                                                                                                                                                      | Severity | Type       | Message                                       | Effort | Tags                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | --------------------------------------------- | ------ | ------------------------ |
| 11  | [L27](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=features/search/components/ExchangeFormCard.tsx) | 🟡 MINOR | CODE_SMELL | Mark the props of the component as read-only. | 5 min  | `type-dependent` `react` |

> **Rule:** `typescript:S6759` — React component props should be `Readonly<>`.

---

### 7. `features/search/services/currency.ts` — 2 issues

| #   | Line                                                                                                                                                                           | Severity    | Type       | Message                                                                                                      | Effort | Tags                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ---------- | ------------------------------------------------------------------------------------------------------------ | ------ | ------------------------------- |
| 12  | [L3](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=features/search/services/currency.ts)  | 🟡 MINOR    | CODE_SMELL | Use `export…from` to re-export `CURRENCY_LIST`.                                                              | 5 min  | `convention`                    |
| 13  | [L10](https://sonarqube.4.194.42.173.sslip.io/project/issues?id=bankease-reactnative-merchant&author=maulana.sechan%40ecomindo.com&files=features/search/services/currency.ts) | 🔴 CRITICAL | BUG        | Provide a compare function that depends on `String.localeCompare`, to reliably sort elements alphabetically. | 10 min | `type-dependent` `bad-practice` |

> **Rule S7763:** Prefer `export { X } from "..."` over `import then re-export`.  
> **Rule S2871 (BUG):** `Array.sort()` without a comparator is locale-dependent and unreliable for string sorting — use `.sort((a, b) => a.localeCompare(b))`.

---

## ⚠️ Note: Uncommitted Files Not Attributed

The following files modified by maulana.sechan were **not yet committed** at the time of the scan. Because they have no `git blame` history, SonarQube cannot attribute any issues found in them to this author. Issues in those files appear without an author in the dashboard:

- `app/payTheBill/index.tsx`
- `app/payTheBill/pay-bill-form.tsx`
- `app/payTheBill/bill-detail.tsx`
- `app/payTheBill/payment-success.tsx`
- `app/(tabs)/search.tsx`
- `components/ui/selector-input.tsx`
- `features/auth/components/forgot-password-screen.tsx`
- `features/dashboard/components/MenuGridItem.tsx`
- `features/payTheBill/api/index.ts`
- `features/payTheBill/hooks/index.ts`
- `features/payTheBill/types.ts`
- `constants/theme.ts`

To include these files in author attribution, commit them to the branch and re-run the scan.
