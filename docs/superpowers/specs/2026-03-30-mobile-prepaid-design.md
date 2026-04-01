# Mobile Prepaid — Feature Design Spec

**Date:** 2026-03-30
**Status:** Approved
**Branch:** `fajri/mobile-prepaid`

---

## Overview

Mobile Prepaid allows merchants to top up prepaid phone credit directly from their BankEase account. The feature is a single-screen flow: select a payment card, choose or enter a phone number (optionally via saved beneficiaries), pick a predefined amount, and submit. On success, a result view replaces the form; on failure, an Alert keeps the user on the form to retry.

## Approach

**Single-Screen Flow (Approach A):** One route `app/mobile-prepaid.tsx` renders `MobilePrepaidScreen`. The screen manages two visual states internally — form and success. A single orchestration hook `useMobilePrepaid()` handles data loading, form state, and submission. Bottom sheet modal for card selection.

---

## 1. Feature Structure & Routing

### Directory Layout

```
features/mobile-prepaid/
├── types.ts                          # Domain interfaces
├── api/
│   └── index.ts                      # submitPrepaid(), getBeneficiaries()
├── components/
│   ├── index.ts                      # barrel export
│   ├── MobilePrepaidScreen.tsx       # main screen (form + success states)
│   ├── CardSelectorSheet.tsx         # bottom sheet for card selection
│   ├── BeneficiaryDirectory.tsx      # horizontal scroll with avatars
│   ├── AmountChips.tsx               # $10/$20/$30 chip row
│   └── PrepaidSuccessView.tsx        # success illustration + message
├── hooks/
│   └── useMobilePrepaid.ts           # orchestration hook
└── locales/
    ├── en.json
    └── id.json
```

### Routing

- **`app/mobile-prepaid.tsx`** — thin route file, renders `<MobilePrepaidScreen />`
- **Navigation in:** `MenuGridItem` updated — when `code === 'MOBILE_PREPAID'`, calls `router.push('/mobile-prepaid')`
- **Navigation out (success):** `router.replace('/(tabs)')` — returns to Dashboard Home
- **Navigation out (back):** `router.back()` via header back arrow

### Privilege Gate

`MOBILE_PREPAID` is already defined in `dashboardService` privilege system:

- `demo-002`: enabled (has all 9 privileges)
- `demo-001`: not enabled (only 3 privileges)
- New accounts: not enabled (only `ACCOUNT_CARD`)

No additional privilege logic needed — the menu item only appears for accounts with the privilege enabled.

---

## 2. Types & Data Model

```typescript
// features/mobile-prepaid/types.ts

export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  avatar?: string; // URL or undefined — fallback to initials
}

export interface AmountOption {
  value: number; // minor units (cents) — e.g., 1000 = $10
  label: string; // display label: "$10"
}

export interface PrepaidPaymentRequest {
  cardId: string;
  phone: string;
  amount: number; // minor units
}

export interface PrepaidPaymentResponse {
  id: string;
  status: "SUCCESS" | "FAILED";
  message: string;
  timestamp: string;
}

export const AMOUNT_OPTIONS: AmountOption[] = [
  { value: 1000, label: "$10" },
  { value: 2000, label: "$20" },
  { value: 3000, label: "$30" },
];
```

### Conventions

- All amounts in **minor units** (cents), consistent with `utils/money.ts`
- `Beneficiary.avatar` is optional — render initials circle as fallback
- Cards reuse existing `PaymentCard` type from `features/dashboard/types.ts` — no new card type

---

## 3. API Layer

### API Functions (`features/mobile-prepaid/api/index.ts`)

Uses `core/api/client.ts` `request<T>()`:

```typescript
// POST /api/mobile-prepaid/pay
submitPrepaid(payload: PrepaidPaymentRequest): Promise<PrepaidPaymentResponse>

// GET /api/mobile-prepaid/beneficiaries?accountId={id}
getBeneficiaries(accountId: string): Promise<Beneficiary[]>
```

### MSW Mock Handlers (added to `mocks/handlers.ts`)

**GET `/api/mobile-prepaid/beneficiaries`:**

```json
[
  { "id": "ben-001", "name": "Emma", "phone": "+8564757899", "avatar": null },
  { "id": "ben-002", "name": "Justin", "phone": "+8123456789", "avatar": null }
]
```

**POST `/api/mobile-prepaid/pay`:**

- Validates: `cardId` required, `phone` required, `amount > 0`
- Default: returns `{ id: "txn-<uuid>", status: "SUCCESS", message: "Payment successful", timestamp: "<now>" }`
- Error case: phone `+0000000000` → returns `{ status: "FAILED", message: "Invalid phone number" }`
- Error case: amount exceeding card balance → returns HTTP 400 with `INSUFFICIENT_FUNDS` error code

---

## 4. Hook & State Management

### `useMobilePrepaid(accountId: string)`

```typescript
// Returns:
{
  // Data loading
  cards: PaymentCard[];
  beneficiaries: Beneficiary[];
  isLoading: boolean;

  // Form state
  selectedCard: PaymentCard | null;
  selectedAmount: AmountOption | null;
  phone: string;

  // Actions
  setSelectedCard: (card: PaymentCard) => void;
  setSelectedAmount: (amount: AmountOption) => void;
  setPhone: (phone: string) => void;
  selectBeneficiary: (b: Beneficiary) => void;  // fills phone from beneficiary

  // Submit
  submit: () => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  reset: () => void;
}
```

### State Flow

1. **Mount** → load cards via `dashboardService.loadCards(accountId)` + fetch beneficiaries via TanStack Query (`useQuery`)
2. **Select card** → user taps card selector field → opens `CardSelectorSheet` → taps card → `setSelectedCard`
3. **Select beneficiary** → `selectBeneficiary(b)` sets `phone = b.phone`
4. **Select amount** → `setSelectedAmount(option)`
5. **Submit** → `submit()` calls `submitPrepaid` API
   - Success → `isSuccess = true` → screen renders `PrepaidSuccessView`
   - Failure → `Alert.alert('Failed', error.message)` → stays on form
6. **Reset** → `reset()` clears all form state (available for future reuse)

### Confirm Button Disabled When

`!selectedCard || !phone || !selectedAmount || isSubmitting`

### Double-Submit Guard

`useRef` boolean flag (same pattern as payout flow) — set `true` on submit entry, reset on completion. Prevents multiple API calls from rapid taps.

---

## 5. UI Components & Visual Design

### MobilePrepaidScreen

- White background, `ScrollView` with `SafeAreaView edges={['top']}`
- Header row: back arrow (`Ionicons chevron-back`, `Pressable`) + "Mobile prepaid" title (Poppins SemiBold 18)
- When `isSuccess === true`, scroll content replaced by `PrepaidSuccessView`
- `contentContainerStyle: { flexGrow: 1 }` to allow Confirm button at bottom

### CardSelectorSheet (Bottom Sheet Modal)

- `React Native Modal` + `transparent` + `animationType="slide"` + overlay `rgba(0,0,0,0.45)`
- Container: white, `borderTopLeftRadius: 24`, `borderTopRightRadius: 24`, `padding: 20`
- Title: "Select card" (Poppins SemiBold 16)
- Card rows: brand icon (VISA text / MC circles) + masked number + balance formatted via `utils/money.ts`
- Selected card: primary-color left border or checkmark icon
- Tap card → calls `onSelect` callback → modal closes
- `onRequestClose` + `accessibilityViewIsModal` for Android accessibility

### Card Selector Field

- Bordered `Pressable` container: `borderRadius: 8`, `border: 1px #E0E0E0`, `padding: 14`
- **Empty state:** placeholder "Choose account / card" in gray (`#9E9E9E`)
- **Filled state:** "VISA \***\* \*\*** \*\*\*\* 1234" in black text
- Below field (when card selected): "Available balance : 10,000$" in primary color (`#3629B7`), Poppins Regular 13 — formatted via `utils/money.ts` `formatMajor(card.balance, card.currency)`

### BeneficiaryDirectory

- Row header: "Directory" label (left, Poppins Medium 14) + "Find beneficiary" link (right, primary color, Poppins Medium 14) — link shows "Coming Soon" alert for now
- Horizontal `ScrollView` with `flexGrow: 0, flexShrink: 0` (required to prevent height expansion)
- **First item:** "+" add button — dashed circle border, light gray background, `Ionicons add` icon — taps show "Coming Soon" alert
- **Beneficiary items:** circular avatar (64px) with image or initials fallback + name below (Poppins Regular 12, centered)
- **Selected state:** primary-color border ring (3px solid `#3629B7`) around avatar
- Gap between items: 16px

### AmountChips

- `View` with `flexDirection: 'row'`, `gap: 12`
- Section label above: "Choose amount" (Poppins Medium 14)
- Each chip: `Pressable`, `paddingHorizontal: 24`, `paddingVertical: 12`, `borderRadius: 24`
- **Active chip:** background `Colors.primary` (`#3629B7`), text white (Poppins SemiBold 14)
- **Inactive chip:** background white, border `1px #E0E0E0`, text `#687076` (Poppins Regular 14)
- Same visual pattern as `ActivityFilterBar` chips

### Phone Number Field

- Section label: "Phone number" (Poppins Medium 14)
- `TextInput` with border style matching card selector field: `borderRadius: 8`, `border: 1px #E0E0E0`, `padding: 14`
- `keyboardType: 'phone-pad'`
- Placeholder: "Phone number" in gray
- Auto-filled when beneficiary tapped, but remains editable

### Confirm Button

- Full-width `Pressable`, `borderRadius: 28`, background `Colors.primary` (`#3629B7`)
- Text: "Confirm" — white, Poppins SemiBold 16, centered
- `paddingVertical: 16`
- **Disabled state:** `opacity: 0.4`, no press handler
- Positioned at bottom: `marginTop: 'auto'` pushes to screen bottom within flexGrow ScrollView

### PrepaidSuccessView

- Centered vertically within screen (`flex: 1, justifyContent: 'center', alignItems: 'center'`)
- Illustration: `assets/images/illustrations/payment-success.png` (~200px width)
- Title: "Payment success!" — Poppins SemiBold 20, primary color (`#3629B7`)
- Subtitle: "You have successfully paid mobile prepaid!" — Poppins Regular 14, gray (`#687076`)
- Confirm button (same style as form button) → `router.replace('/(tabs)')`
- `gap: 16` between elements

---

## 6. Integration Points

### Existing Code Changes

1. **`features/dashboard/components/MenuGridItem.tsx`** — Add routing: when `code === 'MOBILE_PREPAID'`, call `router.push('/mobile-prepaid')` instead of "Coming Soon" alert
2. **`core/i18n/translations.ts`** — Import `features/mobile-prepaid/locales/en.json` + `id.json`, flatten with prefix `mobilePrepaid`
3. **`mocks/handlers.ts`** — Add 2 MSW handlers (GET beneficiaries, POST payment)
4. **Cards reuse** — `useMobilePrepaid` calls `dashboardService.loadCards(accountId)` directly, no duplication

### i18n Keys (`features/mobile-prepaid/locales/en.json`)

Flat dotted keys (compatible with `flattenWithPrefix`):

```json
{
  "screen.title": "Mobile prepaid",
  "card.placeholder": "Choose account / card",
  "card.balance": "Available balance : {{balance}}",
  "card.selectTitle": "Select card",
  "directory.title": "Directory",
  "directory.findBeneficiary": "Find beneficiary",
  "phone.label": "Phone number",
  "phone.placeholder": "Phone number",
  "amount.title": "Choose amount",
  "confirm": "Confirm",
  "success.title": "Payment success!",
  "success.message": "You have successfully paid mobile prepaid!",
  "error.failed": "Failed",
  "comingSoon": "Coming Soon"
}
```

### Assets Needed

- `assets/images/illustrations/payment-success.png` — success screen illustration (from design mockup)

---

## 7. Testing Strategy

### Unit Tests (`features/mobile-prepaid/__tests__/`)

| Test File                       | Coverage                                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `useMobilePrepaid.test.ts`      | Load cards, load beneficiaries, select beneficiary fills phone, submit success/failure, double-submit guard, disabled state logic |
| `mobile-prepaid-api.test.ts`    | API functions with MSW: success response, error responses (invalid phone, insufficient funds)                                     |
| `AmountChips.test.tsx`          | Renders 3 chips, active state toggles on tap, calls `onSelect` callback                                                           |
| `BeneficiaryDirectory.test.tsx` | Renders avatars + names, tap calls `onSelect`, "+" button shows alert                                                             |
| `CardSelectorSheet.test.tsx`    | Renders card list, selection callback fires, modal open/close                                                                     |
| `MobilePrepaidScreen.test.tsx`  | Form renders all sections, confirm disabled when incomplete, success view shown after mock submit                                 |
| `PrepaidSuccessView.test.tsx`   | Renders illustration + text, confirm button calls navigation                                                                      |

### MSW Integration

- Full happy path: select card → enter phone → select amount → submit → verify `isSuccess` state
- Error path: submit with error phone → verify Alert shown, form retained

---

## 8. Error Handling

| Scenario                       | Behavior                                                                  |
| ------------------------------ | ------------------------------------------------------------------------- |
| API returns `status: 'FAILED'` | `Alert.alert('Failed', response.message)`, stay on form                   |
| Network error / timeout        | `Alert.alert('Failed', 'Network error. Please try again.')`, stay on form |
| Insufficient funds (400)       | `Alert.alert('Failed', 'Insufficient balance')`, stay on form             |
| Card loading fails             | Show error state (loadingState/errorState feedback component)             |
| Beneficiary loading fails      | Show empty directory (graceful degradation), form still usable            |

Error classes from `core/api/errors.ts` are used — no string errors.

---

## 9. Decisions Summary

| Decision                                    | Rationale                                                         |
| ------------------------------------------- | ----------------------------------------------------------------- |
| Real API + MSW mock fallback                | Consistent with Profile Edit pattern; API endpoints ready to swap |
| Beneficiaries API-backed (mock now)         | Future-proof; easy to connect real endpoint later                 |
| Predefined amount chips only                | Matches design, simpler UX, no validation needed                  |
| Direct submit (no confirmation modal)       | Design shows single-tap flow, reduces friction                    |
| Success view in-screen (not separate route) | Simple visual swap, avoids route param passing                    |
| Alert on failure                            | Consistent with Profile Edit pattern, user stays on form          |
| Bottom sheet card selector                  | Rich card preview, better UX than flat dropdown                   |
| `useRef` double-submit guard                | Same pattern as payout flow, no re-render                         |
| Reuse `PaymentCard` from dashboard          | No type duplication, cards already loaded via existing service    |
