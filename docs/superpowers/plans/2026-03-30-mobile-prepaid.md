# Mobile Prepaid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Mobile Prepaid top-up feature — card selection via bottom sheet, beneficiary directory, amount chips, MSW-mocked payment API, success view.

**Architecture:** Single-screen flow at `app/mobile-prepaid.tsx` rendering `MobilePrepaidScreen`. One orchestration hook `useMobilePrepaid` manages cards, beneficiaries, form state, and submit. Bottom sheet modal for card picker. MSW handlers for `GET /api/mobile-prepaid/beneficiaries` and `POST /api/mobile-prepaid/pay`.

**Tech Stack:** React Native, Expo Router, TanStack Query, MSW v2, AsyncStorage (cards via dashboardService), Jest + RNTL

**Spec:** `docs/superpowers/specs/2026-03-30-mobile-prepaid-design.md`

---

## File Map

### New Files

| File                                                              | Responsibility                                                                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `features/mobile-prepaid/types.ts`                                | `Beneficiary`, `AmountOption`, `PrepaidPaymentRequest`, `PrepaidPaymentResponse`, `AMOUNT_OPTIONS` constant |
| `features/mobile-prepaid/api/index.ts`                            | `submitPrepaid()`, `getBeneficiaries()` — HTTP calls via `core/api/client.ts`                               |
| `features/mobile-prepaid/hooks/useMobilePrepaid.ts`               | Orchestration hook: load cards + beneficiaries, form state, submit + double-submit guard                    |
| `features/mobile-prepaid/components/AmountChips.tsx`              | Row of predefined amount chips ($10/$20/$30)                                                                |
| `features/mobile-prepaid/components/BeneficiaryDirectory.tsx`     | Horizontal scroll of beneficiary avatars + add button                                                       |
| `features/mobile-prepaid/components/CardSelectorSheet.tsx`        | Bottom sheet modal listing payment cards                                                                    |
| `features/mobile-prepaid/components/PrepaidSuccessView.tsx`       | Success illustration + message + confirm button                                                             |
| `features/mobile-prepaid/components/MobilePrepaidScreen.tsx`      | Main screen composing all components + form/success state swap                                              |
| `features/mobile-prepaid/components/index.ts`                     | Barrel export                                                                                               |
| `features/mobile-prepaid/locales/en.json`                         | English translations (flat dotted keys)                                                                     |
| `features/mobile-prepaid/locales/id.json`                         | Indonesian translations                                                                                     |
| `features/mobile-prepaid/__tests__/AmountChips.test.tsx`          | Unit tests for AmountChips                                                                                  |
| `features/mobile-prepaid/__tests__/BeneficiaryDirectory.test.tsx` | Unit tests for BeneficiaryDirectory                                                                         |
| `features/mobile-prepaid/__tests__/CardSelectorSheet.test.tsx`    | Unit tests for CardSelectorSheet                                                                            |
| `features/mobile-prepaid/__tests__/PrepaidSuccessView.test.tsx`   | Unit tests for PrepaidSuccessView                                                                           |
| `features/mobile-prepaid/__tests__/MobilePrepaidScreen.test.tsx`  | Unit tests for MobilePrepaidScreen                                                                          |
| `features/mobile-prepaid/__tests__/mobile-prepaid-api.test.ts`    | Unit tests for API layer                                                                                    |
| `features/mobile-prepaid/__tests__/useMobilePrepaid.test.ts`      | Unit tests for hook                                                                                         |
| `app/mobile-prepaid.tsx`                                          | Thin Expo Router route file                                                                                 |

### Modified Files

| File                                             | Change                                                       |
| ------------------------------------------------ | ------------------------------------------------------------ |
| `mocks/handlers.ts`                              | Add 2 MSW handlers (GET beneficiaries, POST pay)             |
| `mocks/data.ts`                                  | Add `MOCK_BENEFICIARIES` seed data                           |
| `core/i18n/translations.ts`                      | Import + register mobile-prepaid locale files                |
| `features/dashboard/components/MenuGridItem.tsx` | Route `MOBILE_PREPAID` to `/mobile-prepaid` instead of alert |

---

## Task 1: Types & Constants

**Files:**

- Create: `features/mobile-prepaid/types.ts`

- [ ] **Step 1: Create types file**

```typescript
// features/mobile-prepaid/types.ts

export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface AmountOption {
  value: number; // minor units (cents)
  label: string; // display: "$10"
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

- [ ] **Step 2: Commit**

```bash
git add features/mobile-prepaid/types.ts
git commit -m "feat(mobile-prepaid): add domain types and amount constants"
```

---

## Task 2: API Layer

**Files:**

- Create: `features/mobile-prepaid/api/index.ts`

- [ ] **Step 1: Create API functions**

```typescript
// features/mobile-prepaid/api/index.ts
import { request } from "@/core/api/client";
import type {
  Beneficiary,
  PrepaidPaymentRequest,
  PrepaidPaymentResponse,
} from "../types";

export function getBeneficiaries(accountId: string): Promise<Beneficiary[]> {
  return request<Beneficiary[]>(
    `/api/mobile-prepaid/beneficiaries?accountId=${encodeURIComponent(accountId)}`,
  );
}

export function submitPrepaid(
  payload: PrepaidPaymentRequest,
): Promise<PrepaidPaymentResponse> {
  return request<PrepaidPaymentResponse>("/api/mobile-prepaid/pay", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add features/mobile-prepaid/api/index.ts
git commit -m "feat(mobile-prepaid): add API layer (getBeneficiaries, submitPrepaid)"
```

---

## Task 3: MSW Mock Handlers

**Files:**

- Modify: `mocks/data.ts`
- Modify: `mocks/handlers.ts`

- [ ] **Step 1: Add mock beneficiary data to `mocks/data.ts`**

Add this import type and export at the end of the file:

```typescript
import type { Beneficiary } from "@/features/mobile-prepaid/types";

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id: "ben-001", name: "Emma", phone: "+8564757899" },
  { id: "ben-002", name: "Justin", phone: "+8123456789" },
];
```

- [ ] **Step 2: Add MSW handlers to `mocks/handlers.ts`**

Add import at top:

```typescript
import { MOCK_BENEFICIARIES } from "./data";
```

Add two handlers inside the `handlers` array, after the existing `branches` handler:

```typescript
  // ─── Mobile Prepaid ────────────────────────────────────────────────────
  http.get(`${API_BASE_URL}/api/mobile-prepaid/beneficiaries`, () => {
    return HttpResponse.json(MOCK_BENEFICIARIES);
  }),

  http.post(`${API_BASE_URL}/api/mobile-prepaid/pay`, async ({ request }) => {
    const body = (await request.json()) as {
      cardId?: string;
      phone?: string;
      amount?: number;
    };

    if (!body.cardId || !body.phone || !body.amount || body.amount <= 0) {
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Invalid request' },
        { status: 400 },
      );
    }

    if (body.phone === '+0000000000') {
      return HttpResponse.json(
        {
          id: `txn-${Date.now()}`,
          status: 'FAILED',
          message: 'Invalid phone number',
          timestamp: new Date().toISOString(),
        },
      );
    }

    return HttpResponse.json({
      id: `txn-${Date.now()}`,
      status: 'SUCCESS',
      message: 'Payment successful',
      timestamp: new Date().toISOString(),
    });
  }),
```

- [ ] **Step 3: Commit**

```bash
git add mocks/data.ts mocks/handlers.ts
git commit -m "feat(mobile-prepaid): add MSW mock handlers for beneficiaries and payment"
```

---

## Task 4: API Layer Tests

**Files:**

- Create: `features/mobile-prepaid/__tests__/mobile-prepaid-api.test.ts`

- [ ] **Step 1: Write API tests**

```typescript
// features/mobile-prepaid/__tests__/mobile-prepaid-api.test.ts
import { getBeneficiaries, submitPrepaid } from "../api";

describe("mobile-prepaid API", () => {
  describe("getBeneficiaries", () => {
    it("returns a list of beneficiaries", async () => {
      const result = await getBeneficiaries("demo-002");
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "ben-001", name: "Emma" }),
          expect.objectContaining({ id: "ben-002", name: "Justin" }),
        ]),
      );
    });
  });

  describe("submitPrepaid", () => {
    it("returns SUCCESS for valid payment", async () => {
      const result = await submitPrepaid({
        cardId: "card-001",
        phone: "+8564757899",
        amount: 1000,
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.id).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it("returns FAILED for invalid phone", async () => {
      const result = await submitPrepaid({
        cardId: "card-001",
        phone: "+0000000000",
        amount: 1000,
      });
      expect(result.status).toBe("FAILED");
      expect(result.message).toBe("Invalid phone number");
    });
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npx jest features/mobile-prepaid/__tests__/mobile-prepaid-api.test.ts --verbose
```

Expected: 3 tests PASS

- [ ] **Step 3: Commit**

```bash
git add features/mobile-prepaid/__tests__/mobile-prepaid-api.test.ts
git commit -m "test(mobile-prepaid): add API layer tests"
```

---

## Task 5: i18n Locale Files & Registration

**Files:**

- Create: `features/mobile-prepaid/locales/en.json`
- Create: `features/mobile-prepaid/locales/id.json`
- Modify: `core/i18n/translations.ts`

- [ ] **Step 1: Create English locale**

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

- [ ] **Step 2: Create Indonesian locale**

```json
{
  "screen.title": "Pulsa prabayar",
  "card.placeholder": "Pilih akun / kartu",
  "card.balance": "Saldo tersedia : {{balance}}",
  "card.selectTitle": "Pilih kartu",
  "directory.title": "Direktori",
  "directory.findBeneficiary": "Cari penerima",
  "phone.label": "Nomor telepon",
  "phone.placeholder": "Nomor telepon",
  "amount.title": "Pilih nominal",
  "confirm": "Konfirmasi",
  "success.title": "Pembayaran berhasil!",
  "success.message": "Anda berhasil membayar pulsa prabayar!",
  "error.failed": "Gagal",
  "comingSoon": "Segera Hadir"
}
```

- [ ] **Step 3: Register in `core/i18n/translations.ts`**

Add imports after the existing profile imports:

```typescript
import mobilePrepaidEn from "@/features/mobile-prepaid/locales/en.json";
import mobilePrepaidId from "@/features/mobile-prepaid/locales/id.json";
```

Add to the `en` merge call:

```typescript
flattenWithPrefix(mobilePrepaidEn as Record<string, string>, "mobilePrepaid"),
```

Add to the `id` merge call:

```typescript
flattenWithPrefix(mobilePrepaidId as Record<string, string>, "mobilePrepaid"),
```

- [ ] **Step 4: Commit**

```bash
git add features/mobile-prepaid/locales/en.json features/mobile-prepaid/locales/id.json core/i18n/translations.ts
git commit -m "feat(mobile-prepaid): add i18n locale files and register translations"
```

---

## Task 6: AmountChips Component + Tests

**Files:**

- Create: `features/mobile-prepaid/components/AmountChips.tsx`
- Create: `features/mobile-prepaid/__tests__/AmountChips.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// features/mobile-prepaid/__tests__/AmountChips.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AmountChips } from "../components/AmountChips";
import { AMOUNT_OPTIONS } from "../types";
import type { AmountOption } from "../types";

describe("AmountChips", () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it("renders all amount options", () => {
    const { getByText } = render(<AmountChips selected={null} onSelect={onSelect} />);
    for (const opt of AMOUNT_OPTIONS) {
      expect(getByText(opt.label)).toBeTruthy();
    }
  });

  it("calls onSelect when a chip is tapped", () => {
    const { getByText } = render(<AmountChips selected={null} onSelect={onSelect} />);
    fireEvent.press(getByText("$20"));
    expect(onSelect).toHaveBeenCalledWith(AMOUNT_OPTIONS[1]);
  });

  it("highlights the selected chip", () => {
    const { getByText } = render(
      <AmountChips selected={AMOUNT_OPTIONS[0]} onSelect={onSelect} />,
    );
    const chip = getByText("$10");
    // The selected chip's parent Pressable has a testID
    expect(chip).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest features/mobile-prepaid/__tests__/AmountChips.test.tsx --verbose
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement AmountChips**

```tsx
// features/mobile-prepaid/components/AmountChips.tsx
import React, { memo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { AMOUNT_OPTIONS } from "../types";
import type { AmountOption } from "../types";

interface AmountChipsProps {
  selected: AmountOption | null;
  onSelect: (option: AmountOption) => void;
}

function AmountChipsComponent({ selected, onSelect }: AmountChipsProps) {
  return (
    <View style={styles.row}>
      {AMOUNT_OPTIONS.map((option) => {
        const isActive = selected?.value === option.value;
        return (
          <Pressable
            key={option.value}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.label}
          >
            <ThemedText style={[styles.chipText, isActive && styles.chipTextActive]}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

export const AmountChips = memo(AmountChipsComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  chip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#687076",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest features/mobile-prepaid/__tests__/AmountChips.test.tsx --verbose
```

Expected: 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add features/mobile-prepaid/components/AmountChips.tsx features/mobile-prepaid/__tests__/AmountChips.test.tsx
git commit -m "feat(mobile-prepaid): add AmountChips component with tests"
```

---

## Task 7: BeneficiaryDirectory Component + Tests

**Files:**

- Create: `features/mobile-prepaid/components/BeneficiaryDirectory.tsx`
- Create: `features/mobile-prepaid/__tests__/BeneficiaryDirectory.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// features/mobile-prepaid/__tests__/BeneficiaryDirectory.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import { BeneficiaryDirectory } from "../components/BeneficiaryDirectory";
import type { Beneficiary } from "../types";

jest.spyOn(Alert, "alert");

const BENEFICIARIES: Beneficiary[] = [
  { id: "ben-001", name: "Emma", phone: "+8564757899" },
  { id: "ben-002", name: "Justin", phone: "+8123456789" },
];

describe("BeneficiaryDirectory", () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
    (Alert.alert as jest.Mock).mockClear();
  });

  it("renders beneficiary names", () => {
    const { getByText } = render(
      <BeneficiaryDirectory
        beneficiaries={BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
      />,
    );
    expect(getByText("Emma")).toBeTruthy();
    expect(getByText("Justin")).toBeTruthy();
  });

  it("calls onSelect when a beneficiary is tapped", () => {
    const { getByText } = render(
      <BeneficiaryDirectory
        beneficiaries={BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.press(getByText("Emma"));
    expect(onSelect).toHaveBeenCalledWith(BENEFICIARIES[0]);
  });

  it("shows Coming Soon alert when add button is pressed", () => {
    const { getByLabelText } = render(
      <BeneficiaryDirectory
        beneficiaries={BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.press(getByLabelText("Add beneficiary"));
    expect(Alert.alert).toHaveBeenCalledWith("Coming Soon");
  });

  it("shows Coming Soon alert when Find beneficiary is pressed", () => {
    const { getByText } = render(
      <BeneficiaryDirectory
        beneficiaries={BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.press(getByText("Find beneficiary"));
    expect(Alert.alert).toHaveBeenCalledWith("Coming Soon");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest features/mobile-prepaid/__tests__/BeneficiaryDirectory.test.tsx --verbose
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement BeneficiaryDirectory**

```tsx
// features/mobile-prepaid/components/BeneficiaryDirectory.tsx
import React, { memo } from "react";
import { View, ScrollView, Pressable, Image, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import type { Beneficiary } from "../types";

interface BeneficiaryDirectoryProps {
  beneficiaries: Beneficiary[];
  selectedId: string | null;
  onSelect: (beneficiary: Beneficiary) => void;
}

function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

function BeneficiaryDirectoryComponent({
  beneficiaries,
  selectedId,
  onSelect,
}: BeneficiaryDirectoryProps) {
  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <ThemedText style={styles.headerTitle}>Directory</ThemedText>
        <Pressable onPress={() => Alert.alert("Coming Soon")}>
          <ThemedText style={styles.findLink}>Find beneficiary</ThemedText>
        </Pressable>
      </View>

      {/* Horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add button */}
        <Pressable
          style={styles.addButton}
          onPress={() => Alert.alert("Coming Soon")}
          accessibilityRole="button"
          accessibilityLabel="Add beneficiary"
        >
          <Ionicons name="add" size={28} color="#9E9E9E" />
        </Pressable>

        {/* Beneficiary items */}
        {beneficiaries.map((b) => {
          const isSelected = selectedId === b.id;
          return (
            <Pressable
              key={b.id}
              style={styles.beneficiaryItem}
              onPress={() => onSelect(b)}
              accessibilityRole="button"
              accessibilityLabel={b.name}
            >
              <View style={[styles.avatarWrapper, isSelected && styles.avatarSelected]}>
                {b.avatar ? (
                  <Image source={{ uri: b.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <ThemedText style={styles.avatarInitial}>
                      {getInitials(b.name)}
                    </ThemedText>
                  </View>
                )}
              </View>
              <ThemedText style={styles.beneficiaryName} numberOfLines={1}>
                {b.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export const BeneficiaryDirectory = memo(BeneficiaryDirectoryComponent);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#343434",
  },
  findLink: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: Colors.primary,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  scrollContent: {
    gap: 16,
    paddingRight: 4,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  beneficiaryItem: {
    alignItems: "center",
    width: 72,
    gap: 6,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "transparent",
  },
  avatarSelected: {
    borderColor: Colors.primary,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: "#687076",
  },
  beneficiaryName: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#343434",
    textAlign: "center",
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest features/mobile-prepaid/__tests__/BeneficiaryDirectory.test.tsx --verbose
```

Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add features/mobile-prepaid/components/BeneficiaryDirectory.tsx features/mobile-prepaid/__tests__/BeneficiaryDirectory.test.tsx
git commit -m "feat(mobile-prepaid): add BeneficiaryDirectory component with tests"
```

---

## Task 8: CardSelectorSheet Component + Tests

**Files:**

- Create: `features/mobile-prepaid/components/CardSelectorSheet.tsx`
- Create: `features/mobile-prepaid/__tests__/CardSelectorSheet.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// features/mobile-prepaid/__tests__/CardSelectorSheet.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CardSelectorSheet } from "../components/CardSelectorSheet";
import type { PaymentCard } from "@/features/dashboard/types";

const MOCK_CARDS: PaymentCard[] = [
  {
    id: "card-001",
    accountId: "demo-002",
    holderName: "John Doe",
    cardLabel: "VISA Platinum",
    maskedNumber: "4111  ••••  ••••  1234",
    balance: 1000000,
    currency: "USD",
    brand: "VISA",
    gradientColors: ["#1A1563", "#1E2FA0", "#3B7ED4"],
  },
  {
    id: "card-002",
    accountId: "demo-002",
    holderName: "John Doe",
    cardLabel: "MC Gold",
    maskedNumber: "5200  ••••  ••••  5678",
    balance: 500000,
    currency: "USD",
    brand: "MASTERCARD",
    gradientColors: ["#2D1B69", "#5B2D8E", "#8E4EC6"],
  },
];

describe("CardSelectorSheet", () => {
  const onSelect = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
    onClose.mockClear();
  });

  it("renders card masked numbers when visible", () => {
    const { getByText } = render(
      <CardSelectorSheet
        visible={true}
        cards={MOCK_CARDS}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
    );
    expect(getByText("4111  ••••  ••••  1234")).toBeTruthy();
    expect(getByText("5200  ••••  ••••  5678")).toBeTruthy();
  });

  it("calls onSelect and onClose when a card is tapped", () => {
    const { getByText } = render(
      <CardSelectorSheet
        visible={true}
        cards={MOCK_CARDS}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
    );
    fireEvent.press(getByText("4111  ••••  ••••  1234"));
    expect(onSelect).toHaveBeenCalledWith(MOCK_CARDS[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not render content when not visible", () => {
    const { queryByText } = render(
      <CardSelectorSheet
        visible={false}
        cards={MOCK_CARDS}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
    );
    expect(queryByText("4111  ••••  ••••  1234")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest features/mobile-prepaid/__tests__/CardSelectorSheet.test.tsx --verbose
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement CardSelectorSheet**

```tsx
// features/mobile-prepaid/components/CardSelectorSheet.tsx
import React, { memo } from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { formatCurrency } from "@/utils/money";
import type { PaymentCard } from "@/features/dashboard/types";

interface CardSelectorSheetProps {
  visible: boolean;
  cards: PaymentCard[];
  selectedCardId: string | null;
  onSelect: (card: PaymentCard) => void;
  onClose: () => void;
}

function CardSelectorSheetComponent({
  visible,
  cards,
  selectedCardId,
  onSelect,
  onClose,
}: CardSelectorSheetProps) {
  function handleSelect(card: PaymentCard) {
    onSelect(card);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <ThemedText style={styles.title}>Select card</ThemedText>

          {cards.map((card) => {
            const isSelected = selectedCardId === card.id;
            return (
              <Pressable
                key={card.id}
                style={[styles.cardRow, isSelected && styles.cardRowSelected]}
                onPress={() => handleSelect(card)}
                accessibilityRole="button"
                accessibilityLabel={`${card.brand} ${card.maskedNumber}`}
              >
                <View style={styles.cardInfo}>
                  <ThemedText style={styles.brandText}>{card.brand}</ThemedText>
                  <ThemedText style={styles.maskedNumber}>{card.maskedNumber}</ThemedText>
                </View>
                <ThemedText style={styles.balance}>
                  {formatCurrency(card.balance, card.currency)}
                </ThemedText>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                )}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const CardSelectorSheet = memo(CardSelectorSheetComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#343434",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 12,
  },
  cardRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  brandText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    color: "#687076",
  },
  maskedNumber: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#343434",
  },
  balance: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: Colors.primary,
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest features/mobile-prepaid/__tests__/CardSelectorSheet.test.tsx --verbose
```

Expected: 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add features/mobile-prepaid/components/CardSelectorSheet.tsx features/mobile-prepaid/__tests__/CardSelectorSheet.test.tsx
git commit -m "feat(mobile-prepaid): add CardSelectorSheet component with tests"
```

---

## Task 9: PrepaidSuccessView Component + Tests

**Files:**

- Create: `features/mobile-prepaid/components/PrepaidSuccessView.tsx`
- Create: `features/mobile-prepaid/__tests__/PrepaidSuccessView.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// features/mobile-prepaid/__tests__/PrepaidSuccessView.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PrepaidSuccessView } from "../components/PrepaidSuccessView";

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

describe("PrepaidSuccessView", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("renders success title and message", () => {
    const { getByText } = render(<PrepaidSuccessView />);
    expect(getByText("Payment success!")).toBeTruthy();
    expect(getByText("You have successfully paid mobile prepaid!")).toBeTruthy();
  });

  it("navigates to home when confirm is pressed", () => {
    const { getByText } = render(<PrepaidSuccessView />);
    fireEvent.press(getByText("Confirm"));
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest features/mobile-prepaid/__tests__/PrepaidSuccessView.test.tsx --verbose
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement PrepaidSuccessView**

```tsx
// features/mobile-prepaid/components/PrepaidSuccessView.tsx
import React, { memo } from "react";
import { View, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";

function PrepaidSuccessViewComponent() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/illustrations/payment-success.png")}
        style={styles.illustration}
        resizeMode="contain"
      />
      <ThemedText style={styles.title}>Payment success!</ThemedText>
      <ThemedText style={styles.message}>
        You have successfully paid mobile prepaid!
      </ThemedText>
      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(tabs)")}
        accessibilityRole="button"
        accessibilityLabel="Confirm"
      >
        <ThemedText style={styles.buttonText}>Confirm</ThemedText>
      </Pressable>
    </View>
  );
}

export const PrepaidSuccessView = memo(PrepaidSuccessViewComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  illustration: {
    width: 240,
    height: 180,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: Colors.primary,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#687076",
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
  },
});
```

Note: `assets/images/illustrations/payment-success.png` must exist. The illustration from the design mockup should be placed there before this component renders correctly. For tests the image require will be auto-mocked by jest-expo.

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest features/mobile-prepaid/__tests__/PrepaidSuccessView.test.tsx --verbose
```

Expected: 2 tests PASS

- [ ] **Step 5: Commit**

```bash
git add features/mobile-prepaid/components/PrepaidSuccessView.tsx features/mobile-prepaid/__tests__/PrepaidSuccessView.test.tsx
git commit -m "feat(mobile-prepaid): add PrepaidSuccessView component with tests"
```

---

## Task 10: useMobilePrepaid Hook + Tests

**Files:**

- Create: `features/mobile-prepaid/hooks/useMobilePrepaid.ts`
- Create: `features/mobile-prepaid/__tests__/useMobilePrepaid.test.ts`

- [ ] **Step 1: Write the failing test**

```tsx
// features/mobile-prepaid/__tests__/useMobilePrepaid.test.ts
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useMobilePrepaid } from "../hooks/useMobilePrepaid";
import { createWrapper } from "@/test-utils/createWrapper";
import { AMOUNT_OPTIONS } from "../types";
import type { PaymentCard } from "@/features/dashboard/types";

jest.spyOn(Alert, "alert");

// Mock dashboardService.loadCards
const MOCK_CARDS: PaymentCard[] = [
  {
    id: "card-001",
    accountId: "demo-002",
    holderName: "John Doe",
    cardLabel: "VISA Platinum",
    maskedNumber: "4111  ••••  ••••  1234",
    balance: 1000000,
    currency: "USD",
    brand: "VISA",
    gradientColors: ["#1A1563", "#1E2FA0", "#3B7ED4"],
  },
];

jest.mock("@/features/dashboard/services/dashboard-service", () => ({
  dashboardService: {
    loadCards: jest.fn().mockResolvedValue(MOCK_CARDS),
  },
}));

describe("useMobilePrepaid", () => {
  const { Wrapper } = createWrapper();

  beforeEach(() => {
    (Alert.alert as jest.Mock).mockClear();
  });

  it("loads cards and beneficiaries on mount", async () => {
    const { result } = renderHook(() => useMobilePrepaid("demo-002"), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cards).toHaveLength(1);
    expect(result.current.beneficiaries.length).toBeGreaterThan(0);
  });

  it("selectBeneficiary fills phone field", async () => {
    const { result } = renderHook(() => useMobilePrepaid("demo-002"), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.selectBeneficiary(result.current.beneficiaries[0]);
    });

    expect(result.current.phone).toBe(result.current.beneficiaries[0].phone);
  });

  it("submit succeeds with valid data", async () => {
    const { result } = renderHook(() => useMobilePrepaid("demo-002"), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSelectedCard(result.current.cards[0]);
      result.current.setPhone("+8564757899");
      result.current.setSelectedAmount(AMOUNT_OPTIONS[0]);
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.isSuccess).toBe(true);
  });

  it("submit shows alert on failure", async () => {
    const { result } = renderHook(() => useMobilePrepaid("demo-002"), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSelectedCard(result.current.cards[0]);
      result.current.setPhone("+0000000000");
      result.current.setSelectedAmount(AMOUNT_OPTIONS[0]);
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith("Failed", "Invalid phone number");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest features/mobile-prepaid/__tests__/useMobilePrepaid.test.ts --verbose
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement useMobilePrepaid hook**

```typescript
// features/mobile-prepaid/hooks/useMobilePrepaid.ts
import { useState, useRef, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/features/dashboard/services/dashboard-service";
import { getBeneficiaries, submitPrepaid } from "../api";
import type { PaymentCard } from "@/features/dashboard/types";
import type { AmountOption, Beneficiary } from "../types";

export function useMobilePrepaid(accountId: string) {
  // ─── Data loading ───────────────────────────────────────────────────
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    dashboardService.loadCards(accountId).then((loaded) => {
      if (!cancelled) {
        setCards(loaded);
        setCardsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  const { data: beneficiaries = [], isLoading: beneficiariesLoading } = useQuery({
    queryKey: ["mobile-prepaid", "beneficiaries", accountId],
    queryFn: () => getBeneficiaries(accountId),
  });

  const isLoading = cardsLoading || beneficiariesLoading;

  // ─── Form state ─────────────────────────────────────────────────────
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<AmountOption | null>(null);
  const [phone, setPhone] = useState("");
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);

  // ─── Submit ─────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const submittingRef = useRef(false);

  const selectBeneficiary = useCallback((b: Beneficiary) => {
    setPhone(b.phone);
    setSelectedBeneficiaryId(b.id);
  }, []);

  const submit = useCallback(async () => {
    if (submittingRef.current) return;
    if (!selectedCard || !phone || !selectedAmount) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const result = await submitPrepaid({
        cardId: selectedCard.id,
        phone,
        amount: selectedAmount.value,
      });

      if (result.status === "SUCCESS") {
        setIsSuccess(true);
      } else {
        Alert.alert("Failed", result.message);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Network error. Please try again.";
      Alert.alert("Failed", message);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [selectedCard, phone, selectedAmount]);

  const reset = useCallback(() => {
    setSelectedCard(null);
    setSelectedAmount(null);
    setPhone("");
    setSelectedBeneficiaryId(null);
    setIsSuccess(false);
  }, []);

  return {
    cards,
    beneficiaries,
    isLoading,
    selectedCard,
    selectedAmount,
    phone,
    selectedBeneficiaryId,
    setSelectedCard,
    setSelectedAmount,
    setPhone,
    selectBeneficiary,
    submit,
    isSubmitting,
    isSuccess,
    reset,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest features/mobile-prepaid/__tests__/useMobilePrepaid.test.ts --verbose
```

Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add features/mobile-prepaid/hooks/useMobilePrepaid.ts features/mobile-prepaid/__tests__/useMobilePrepaid.test.ts
git commit -m "feat(mobile-prepaid): add useMobilePrepaid orchestration hook with tests"
```

---

## Task 11: MobilePrepaidScreen + Barrel Export

**Files:**

- Create: `features/mobile-prepaid/components/MobilePrepaidScreen.tsx`
- Create: `features/mobile-prepaid/components/index.ts`

- [ ] **Step 1: Implement MobilePrepaidScreen**

```tsx
// features/mobile-prepaid/components/MobilePrepaidScreen.tsx
import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { formatCurrency } from "@/utils/money";
import { authService } from "@/features/auth/services/auth-service";
import { useMobilePrepaid } from "../hooks/useMobilePrepaid";
import { AmountChips } from "./AmountChips";
import { BeneficiaryDirectory } from "./BeneficiaryDirectory";
import { CardSelectorSheet } from "./CardSelectorSheet";
import { PrepaidSuccessView } from "./PrepaidSuccessView";

interface MobilePrepaidScreenInnerProps {
  accountId: string;
}

function MobilePrepaidScreenInner({ accountId }: MobilePrepaidScreenInnerProps) {
  const router = useRouter();
  const {
    cards,
    beneficiaries,
    isLoading,
    selectedCard,
    selectedAmount,
    phone,
    selectedBeneficiaryId,
    setSelectedCard,
    setSelectedAmount,
    setPhone,
    selectBeneficiary,
    submit,
    isSubmitting,
    isSuccess,
  } = useMobilePrepaid(accountId);

  const [sheetVisible, setSheetVisible] = useState(false);

  const isAllFilled = !!selectedCard && !!phone && !!selectedAmount;

  if (isSuccess) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <PrepaidSuccessView />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color="#343434" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Mobile prepaid</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card selector */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Choose account/ card</ThemedText>
          <Pressable
            style={styles.cardField}
            onPress={() => setSheetVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Choose account or card"
          >
            <ThemedText
              style={[styles.cardFieldText, !selectedCard && styles.cardFieldPlaceholder]}
            >
              {selectedCard
                ? `${selectedCard.brand} ${selectedCard.maskedNumber}`
                : "Choose account / card"}
            </ThemedText>
          </Pressable>
          {selectedCard && (
            <ThemedText style={styles.balanceText}>
              Available balance :{" "}
              {formatCurrency(selectedCard.balance, selectedCard.currency)}
            </ThemedText>
          )}
        </View>

        {/* Beneficiary directory */}
        <View style={styles.section}>
          <BeneficiaryDirectory
            beneficiaries={beneficiaries}
            selectedId={selectedBeneficiaryId}
            onSelect={selectBeneficiary}
          />
        </View>

        {/* Phone number */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Phone number</ThemedText>
          <TextInput
            style={styles.textInput}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            placeholderTextColor="#9E9E9E"
            keyboardType="phone-pad"
            accessibilityLabel="Phone number"
          />
        </View>

        {/* Amount chips */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Choose amount</ThemedText>
          <AmountChips selected={selectedAmount} onSelect={setSelectedAmount} />
        </View>

        {/* Spacer to push Confirm to bottom */}
        <View style={styles.spacer} />

        {/* Confirm button */}
        <Pressable
          style={[
            styles.confirmButton,
            (!isAllFilled || isSubmitting) && styles.confirmDisabled,
          ]}
          onPress={submit}
          disabled={!isAllFilled || isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Confirm"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.confirmText}>Confirm</ThemedText>
          )}
        </Pressable>
      </ScrollView>

      {/* Card selector bottom sheet */}
      <CardSelectorSheet
        visible={sheetVisible}
        cards={cards}
        selectedCardId={selectedCard?.id ?? null}
        onSelect={setSelectedCard}
        onClose={() => setSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

export function MobilePrepaidScreen() {
  const [accountId, setAccountId] = useState<string | null>(null);

  React.useEffect(() => {
    authService.getSessionAccount().then((account) => {
      if (account) {
        setAccountId(account.id);
      }
    });
  }, []);

  if (!accountId) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return <MobilePrepaidScreenInner accountId={accountId} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#343434",
  },
  headerSpacer: {
    width: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  section: {
    marginTop: 20,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#687076",
  },
  cardField: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 14,
  },
  cardFieldText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#343434",
  },
  cardFieldPlaceholder: {
    color: "#9E9E9E",
  },
  balanceText: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: Colors.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#343434",
  },
  spacer: {
    flex: 1,
    minHeight: 32,
  },
  confirmButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    marginTop: 16,
  },
  confirmDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
  },
});
```

- [ ] **Step 2: Create barrel export**

```typescript
// features/mobile-prepaid/components/index.ts
export { MobilePrepaidScreen } from "./MobilePrepaidScreen";
export { AmountChips } from "./AmountChips";
export { BeneficiaryDirectory } from "./BeneficiaryDirectory";
export { CardSelectorSheet } from "./CardSelectorSheet";
export { PrepaidSuccessView } from "./PrepaidSuccessView";
```

- [ ] **Step 3: Commit**

```bash
git add features/mobile-prepaid/components/MobilePrepaidScreen.tsx features/mobile-prepaid/components/index.ts
git commit -m "feat(mobile-prepaid): add MobilePrepaidScreen and barrel export"
```

---

## Task 12: MobilePrepaidScreen Tests

**Files:**

- Create: `features/mobile-prepaid/__tests__/MobilePrepaidScreen.test.tsx`

- [ ] **Step 1: Write screen tests**

```tsx
// features/mobile-prepaid/__tests__/MobilePrepaidScreen.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { MobilePrepaidScreen } from "../components/MobilePrepaidScreen";
import { createWrapper } from "@/test-utils/createWrapper";
import type { PaymentCard } from "@/features/dashboard/types";

jest.spyOn(Alert, "alert");

const mockBack = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
}));

const MOCK_CARDS: PaymentCard[] = [
  {
    id: "card-001",
    accountId: "demo-002",
    holderName: "John Doe",
    cardLabel: "VISA Platinum",
    maskedNumber: "4111  ••••  ••••  1234",
    balance: 1000000,
    currency: "USD",
    brand: "VISA",
    gradientColors: ["#1A1563", "#1E2FA0", "#3B7ED4"],
  },
];

jest.mock("@/features/dashboard/services/dashboard-service", () => ({
  dashboardService: {
    loadCards: jest.fn().mockResolvedValue(MOCK_CARDS),
  },
}));

jest.mock("@/features/auth/services/auth-service", () => ({
  authService: {
    getSessionAccount: jest.fn().mockResolvedValue({
      id: "demo-002",
      name: "Test User",
      phone: "1234567890",
      password: "test",
      createdAt: "2026-01-01",
    }),
  },
}));

describe("MobilePrepaidScreen", () => {
  const { Wrapper } = createWrapper();

  beforeEach(() => {
    mockBack.mockClear();
    mockReplace.mockClear();
    (Alert.alert as jest.Mock).mockClear();
  });

  it("renders the form after loading", async () => {
    const { getByText, getByLabelText } = render(
      <Wrapper>
        <MobilePrepaidScreen />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByText("Mobile prepaid")).toBeTruthy();
    });

    expect(getByText("Choose account / card")).toBeTruthy();
    expect(getByLabelText("Phone number")).toBeTruthy();
    expect(getByText("$10")).toBeTruthy();
    expect(getByText("$20")).toBeTruthy();
    expect(getByText("$30")).toBeTruthy();
  });

  it("confirm button is disabled when form is incomplete", async () => {
    const { getByLabelText } = render(
      <Wrapper>
        <MobilePrepaidScreen />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByLabelText("Confirm")).toBeTruthy();
    });

    const confirmButton = getByLabelText("Confirm");
    expect(
      confirmButton.props.accessibilityState?.disabled ?? confirmButton.props.disabled,
    ).toBeTruthy();
  });

  it("navigates back when back arrow is pressed", async () => {
    const { getByLabelText } = render(
      <Wrapper>
        <MobilePrepaidScreen />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByLabelText("Go back")).toBeTruthy();
    });

    fireEvent.press(getByLabelText("Go back"));
    expect(mockBack).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npx jest features/mobile-prepaid/__tests__/MobilePrepaidScreen.test.tsx --verbose
```

Expected: 3 tests PASS

- [ ] **Step 3: Commit**

```bash
git add features/mobile-prepaid/__tests__/MobilePrepaidScreen.test.tsx
git commit -m "test(mobile-prepaid): add MobilePrepaidScreen tests"
```

---

## Task 13: Route File & MenuGridItem Navigation

**Files:**

- Create: `app/mobile-prepaid.tsx`
- Modify: `features/dashboard/components/MenuGridItem.tsx`

- [ ] **Step 1: Create route file**

```tsx
// app/mobile-prepaid.tsx
import { MobilePrepaidScreen } from "@/features/mobile-prepaid/components";

export default function MobilePrepaidRoute() {
  return <MobilePrepaidScreen />;
}
```

- [ ] **Step 2: Update MenuGridItem to route MOBILE_PREPAID**

In `features/dashboard/components/MenuGridItem.tsx`, add the router import and update the `handlePress` function:

Add import at top:

```typescript
import { useRouter } from "expo-router";
```

Replace the component body with:

```tsx
function MenuGridItemComponent({ privilege }: MenuGridItemProps) {
  const { t } = useTranslation();
  const router = useRouter();

  function handlePress() {
    if (privilege.code === 'MOBILE_PREPAID') {
      router.push('/mobile-prepaid');
      return;
    }
    Alert.alert(
      t('dashboard.comingSoon.title'),
      t('dashboard.comingSoon.message'),
    );
  }
```

The rest of the component stays the same.

- [ ] **Step 3: Commit**

```bash
git add app/mobile-prepaid.tsx features/dashboard/components/MenuGridItem.tsx
git commit -m "feat(mobile-prepaid): add route and wire MenuGridItem navigation"
```

---

## Task 14: Full Test Suite Run & Verification

**Files:** None (verification only)

- [ ] **Step 1: Run all mobile-prepaid tests**

```bash
npx jest features/mobile-prepaid/ --verbose
```

Expected: All tests PASS (API: 3, AmountChips: 3, BeneficiaryDirectory: 4, CardSelectorSheet: 3, PrepaidSuccessView: 2, useMobilePrepaid: 4, MobilePrepaidScreen: 3 = ~22 tests)

- [ ] **Step 2: Run full test suite to check for regressions**

```bash
npm test
```

Expected: All existing tests (90+) plus new tests (~22) PASS with no regressions.

- [ ] **Step 3: TypeScript check**

```bash
npm run typecheck
```

Expected: No type errors.

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix(mobile-prepaid): address test/type issues from full suite run"
```
