---
name: implementation-patterns
description: "Reference implementation patterns for BankEase features. Use when building auth screens, dashboard components, profile edit forms, modals, filter bars, payout flows, or any feature-specific UI in this Expo project. Contains verified patterns and root-cause bug fixes."
argument-hint: 'Feature area or pattern name, e.g. "auth screen", "dashboard home", "modal", "profile edit", "filter bar", "payout flow"'
---

# Implementation Patterns

## When to Use

- Building or modifying an auth screen (sign-in / sign-up)
- Working on Dashboard Home (header, cards, menu grid, floating tab bar)
- Editing Profile Edit screen (form, API, snapshot pattern)
- Adding a modal (pattern from ActivityDetailModal)
- Adding a horizontal filter bar with chips
- Editing the payout flow
- Working with component conventions (ThemedText, i18n, Pressable)

---

## Auth Screen (Sign In / Sign Up)

### Layout

- Sign In: `app/index.tsx` (landing default)
- Sign Up: `app/sign-up.tsx` (separate route, not overlay/modal)
- Navigation: `router.push('/sign-up')` from sign-in, `router.back()` from sign-up
- After login success: `router.replace('/(tabs)')` to replace auth stack

### Two-Layer Composition (iOS-safe)

- **ROOT CAUSE BUG to avoid**: `position:'absolute'` + `flex:1` bottom sheet without fixed height → overlap on different screen sizes
- Correct pattern: purple section (header + hero) + white sheet (`flex:1`), both **normal layout children** inside `ScrollView` with `contentContainerStyle={{ flexGrow:1 }}`
- `flex:1` on white sheet + `flexGrow:1` on `contentContainerStyle` = sheet fills remaining vertical space without absolute positioning
- `SafeAreaView edges={['top']}` wraps header section only (flex:0), not entire screen

### Input Styling

- White panel inputs: `SHEET_INPUT_BORDER = 'rgba(0,0,0,0.12)'`, `SHEET_TEXT = Colors.textBlack`
- **`autoCapitalize="none"` + `autoCorrect={false}` required on all password fields** — Android silently modifies input when `secureTextEntry=false` (show password mode)

### After Sign-Up

- Return to sign-in with `router.back()` — user logs in explicitly (no auto-login)

---

## Local Auth Dummy (AsyncStorage)

### Service Structure

- `features/auth/services/auth-service.ts` — three concerns: `signIn`, `signUp`, `getSession`/`clearSession`, `getSessionAccount`
- Storage keys: `@auth:accounts` (array), `@auth:session` (active session)
- Seed data pre-loaded on first `loadAccounts()` call (if storage empty)

### Critical: Upsert Pattern

- **`loadAccounts()` must upsert each seed by id** — loop `SEED_ACCOUNTS`, check per-id, don't just seed when storage is null
- If emulator/device ran before seeds were introduced, seeds won't exist without upsert
- `getSessionAccount()` = `getSession()` + `loadAccounts()` → return `LocalAuthAccount | null`

### Password & Phone Gotchas

- **Always `.trim()` password** before save in `signUp` and before compare in `signIn` — Android keyboard adds trailing whitespace
- **Don't use visual prefix (+62) on phone field** without also saving it to storage — inconsistent format between sign-up/sign-in is root cause of login failure
- Validate phone duplication before write, not after

### Locale Format

- `features/auth/locales/en.json` and `id.json` use flat dotted keys (`"signUp.title": "Sign up"`) — compatible with `flattenWithPrefix` in `app/_i18n.ts`
- Every new feature with locales must register import in `app/_i18n.ts`

---

## Dashboard Home

### Data Hook

- `useDashboard()` uses **`useFocusEffect` + `useCallback`** (not `useEffect`) — data re-fetched every time Home tab is active/focused
- Critical for syncing after user edits profile then returns to Home

### Services

- `dashboardService.getPrivileges(accountId)` — synchronous, hardcoded `ROLE_MAP`, not AsyncStorage
- `dashboardService.loadCards(accountId)` — AsyncStorage key `@dashboard:cards`, upsert seed per accountId by card id
- `dashboardService.getNotificationCount(accountId)` — AsyncStorage key `@dashboard:notifications:{accountId}`, default 3
- New (sign-up) accounts get `DEFAULT_ROLE` = only `ACCOUNT_CARD`

### DashboardHeader

- `LinearGradient` from `expo-linear-gradient` — install via `npx expo install expo-linear-gradient`
- Wraps `SafeAreaView edges=['top']` **inside** `LinearGradient`, not the reverse
- Notification icon: PNG asset `icon_notification.png` with `tintColor: white` (not Ionicons)
- Avatar: solid white background (`Colors.white`) + `Colors.primary` icon (not `rgba(255,255,255,0.2)`)
- `avatarUri?: string` prop — render `<Image>` if available, fallback to Ionicons; `overflow: 'hidden'` required for circular clip
- i18n interpolation: `t('dashboard.header.greeting').replace('{{name}}', name)` — `useTranslation` doesn't support templates natively

### AccountCard & Carousel

- `AccountCard`: `width: '100%'` (not fixed `CARD_WIDTH`) — wrapper controls width; 3-color horizontal gradient; VISA logo from `icon_visa.png`; MC = 2 overlapping circles; NFC arcs via borderRadius
- `AccountCardCarousel` = stacked card visual (not horizontal FlatList): `position:absolute` layers, front card `logicalIdx=0`, `INSET_PER_LAYER=10px` left+right + `PEEK=14px` top offset, opacity `[1, 0.82, 0.62]`
- Render `[...layers].reverse()` so back cards render first (lower z-order); use `logicalIdx` for offset & opacity

### FeatureMenuGrid

- **Plain `View` + `map`** rows of 3 items — **NOT FlatList** (FlatList `scrollEnabled=false` inside ScrollView doesn't report height correctly on Android)

### FloatingTabBar

- Custom `FloatingTabBar` via `tabBar` prop (not `tabBarStyle`): `position:absolute`, `left:20/right:20`, `borderRadius:32`, shadow/elevation, `zIndex:100`
- Active tab: pill `(flexDirection:row, gap:6, px:14, py:9, borderRadius:22, bg:Colors.primary)` + 18×18 white icon + white label
- Inactive tab: `Image` 24×24 `tintColor:'#9E9EAE'`, no label
- **`Pressable`** (not `PlatformPressable`) for tab button — PlatformPressable on iOS renders RN Navigation internal children
- Navigation: `navigation.emit({ type:'tabPress', target:route.key, canPreventDefault:true })` — not `navigate()` directly
- `zIndex:100` on `barWrapper` + `paddingBottom:110` on `scrollContent` to prevent ScrollView overlap

### i18n File Naming

- `app/_i18n.ts` — prefix `_` so Expo Router doesn't treat it as a route (eliminates WARN "missing default export")

---

## Profile Edit Screen

### Architecture

- `ProfileScreen` in `features/profile/components/ProfileScreen.tsx` — routed from `app/(tabs)/settings.tsx`
- `useProfile()` hook: load via `profileService.loadProfile(accountId)` → GET real API; save via `profileService.saveProfile(accountId, data)` → PUT real API
- `profileService` has `PROFILE_ID_MAP` mapping dummy ID (`demo-001`) → real UUID; sign-up accounts use UUID directly

### Form Pre-fill (hasPopulated ref)

- `useRef hasPopulated` — populate form fields only once when data first loads, **not every time `profile` state changes**
- This prevents accidental form reset

### Snapshot Pattern (revert-on-failure)

- `useRef snapshot` stores last successfully saved/loaded values
- Save fails → revert form to snapshot values
- Save succeeds → update snapshot to new values

### Save Behavior

- **`saveProfile` returns `boolean`** — `true` = success, `false` = failure
- **Don't update `profile` state in hook on success** — it would re-trigger `useEffect([profile])` and reset the form (root cause of form reset bug)
- `displayName` local state in screen — updated directly on save success without re-fetch

### UI Rules

- Confirm button disabled when any field is empty (`isAllFilled` check)
- Alert: `Alert.alert('Success', ...)` on success; `Alert.alert('Failed', ...)` on failure
- Profile image: `<Image source={{ uri: profile.image }}>` if available; fallback to `<Ionicons name="person">`; avatar `overflow: 'hidden'` required

---

## Modal Pattern (from ActivityDetailModal)

- `React Native Modal` with `transparent` + `animationType="fade"` + overlay `rgba(0,0,0,0.45)`
- Container: `borderRadius: 16`, `padding: 20`, `gap: 20`
- `Row` helper component (label + value) for displaying detail fields
- Always add `onRequestClose` and `accessibilityViewIsModal` for Android accessibility
- State: `useState<T | null>` local in screen — no separate hook for pure UI state
- `memo()` on modal component to prevent unnecessary re-renders
- `requestAnimationFrame` needed when transitioning from confirm modal to result modal (avoids React state conflict)

---

## Horizontal Filter Bar

- `ScrollView horizontal` with `flexGrow: 0, flexShrink: 0` in `style` — **REQUIRED**, without this ScrollView fills entire screen height
- Chips: `Pressable` + `accessibilityState={{ selected: isActive }}`
- Active chip: background `Colors.light.tint` + white text
- Inactive chip: border `#C7C7CC` + text `#687076`
- Reset scroll to top on filter change: `flatListRef.current?.scrollToOffset({ offset: 0, animated: false })` in `useEffect([activeFilter])`

### Query Integration

- Include filter params in `queryKey` so TanStack Query auto-refetches & resets pagination
- Pattern: `queryKey: ["activity", dateFrom ?? null, dateTo ?? null]`
- Helper: `getDateRangeForFilter(filter)` from `utils/date.ts` returns `{ dateFrom, dateTo } | null`
- `null` = "All" (don't send params to API)

---

## Payout Flow

- Main logic in `features/payout/hooks/usePayoutFlow.ts`
- **Don't add business logic in `app/(tabs)/payouts.tsx`** — keep route file thin
- Idempotency key generated once in `start()`, not in `confirm()`
- Biometric threshold: 100,000 minor units (£1,000) — checked in flow hook, not API layer
- Double-submit guard: use `ref` not `state` (avoids re-render)

---

## useMutation Pattern (submit actions)

Use `useMutation` from `@tanstack/react-query` for **any submit action** that calls an API (POST/PUT/PATCH/DELETE). Do **not** use `useState` + `useRef` + manual `try/catch/finally`.

### Why useMutation, not manual state

| Manual approach                                              | useMutation                                     |
| ------------------------------------------------------------ | ----------------------------------------------- |
| `[isSubmitting, setIsSubmitting]` useState + `submittingRef` | `isPending` — built-in, race-safe               |
| `[isSuccess, setIsSuccess]` useState                         | `isSuccess` — built-in                          |
| `async submit` + `try/catch/finally`                         | `onSuccess` / `onError` callbacks               |
| Submit handler must be `async`, callers may need to await    | `submit` is sync, just calls `mutate()`         |
| Double-submit guard needs manual `ref`                       | `mutate()` is a no-op while `isPending` is true |

### Canonical Pattern

```ts
// In a ViewModel Hook (e.g. useMobilePrepaid.ts)
import { useMutation } from "@tanstack/react-query";

const {
  mutate,
  isPending: isSubmitting,
  isSuccess,
} = useMutation({
  mutationFn: submitPrepaid, // the API function
  onSuccess: (result) => {
    // handle SOFT failures (API returned 200 but status !== "SUCCESS")
    if (result.status !== "SUCCESS") {
      Alert.alert("Failed", result.message);
    }
  },
  onError: (error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Network error. Please try again.";
    Alert.alert("Failed", message);
  },
});

// submit handler is now synchronous
const submit = useCallback(() => {
  if (!selectedCard || !phone || !selectedAmount) return;
  mutate({
    cardId: selectedCard.id,
    phone,
    amount: selectedAmount.value,
    idempotencyKey: idempotencyKeyRef.current,
  });
}, [selectedCard, phone, selectedAmount, mutate]);
```

### Idempotency Key Integration

Generate once per form session, reset after success:

```ts
const idempotencyKeyRef = useRef(Crypto.randomUUID()); // from expo-crypto

// In reset() — called after success or on form clear:
idempotencyKeyRef.current = Crypto.randomUUID();

// Pass to mutate() payload and send as header in the API function:
export function submitPrepaid(
  payload: PrepaidPaymentRequest,
): Promise<PrepaidPaymentResponse> {
  return request<PrepaidPaymentResponse>("/api/mobile-prepaid/pay", {
    method: "POST",
    headers: { "Idempotency-Key": payload.idempotencyKey },
    body: JSON.stringify(payload),
  });
}
```

### Exposing from the ViewModel Hook

Flatten `isPending` / `isSuccess` — don't leak `UseMutationResult` to the component:

```ts
return {
  // status flags
  isSubmitting, // rename from isPending for UI readability
  isSuccess,
  // actions
  submit,
  reset,
};
```

### On "SOFT failure" vs thrown error

- **Thrown error** (`onError`): network failure, HTTP error status (4xx/5xx) — API layer throws
- **Soft failure** (`onSuccess`): API returns 200 but `result.status === "FAILED"` — handle inside `onSuccess`, NOT `onError`

---

## Component Conventions

- Use `ThemedText` / `ThemedView` from `components/ui/` for automatic dark mode
- User-facing text via i18n (`useTranslation` hook)
- `Pressable` over `TouchableOpacity` — project standard
- `onPress?: () => void` optional prop pattern — backward-compatible reuse
- `memo()` for modals and heavy components

---

## ViewModel Hook Pattern

### What It Is

A single custom hook that owns **all** state, data fetching, and actions for one screen or feature section. The component that consumes it is a pure View with zero business logic.

Named after the MVVM pattern — hook = ViewModel, component = View.

### When to Use

- A screen has both async server data **and** local selection state + a submit action
- The screen component would otherwise contain `useState`, `useQuery`, and handler logic mixed together
- You want the component to be testable as a pure render function (just pass props/hook result)

### Shape Convention

Return a flat object grouped into four buckets — always in this order for readability:

```ts
return {
  // 1. Server data
  cards,
  beneficiaries,

  // 2. Async status flags
  isLoading,
  isSubmitting,
  isSuccess,

  // 3. Local state values (mirrors useState value)
  selectedCard,
  selectedAmount,
  phone,
  selectedBeneficiaryId,

  // 4. Actions / setters
  setSelectedCard,
  setSelectedAmount,
  setPhone,
  selectBeneficiary,
  submit,
};
```

### Data Fetching — Always TanStack Query

- **Always use `useQuery` / `useMutation` for any async server data** — don't reach for `useState` + `useEffect` + manual fetch
- `useQuery` handles caching, background refresh, `isLoading`/`isError` flags, and retries for free
- `useMutation` handles `isPending` / `isSuccess` / `isError` for submit actions — use its `onSuccess`/`onError` callbacks instead of manual `try/catch` state. See **useMutation Pattern** section for canonical code.
- Expose flattened flags (`isLoading`, `isSubmitting`, `isSuccess`) from the hook — don't leak `QueryResult` objects to the component
- Exception: genuinely local-only state (selected chip, typed phone number) stays as `useState`

### Naming Rules

- Hook: `use<FeatureName>` or `use<ScreenName>` — e.g. `useMobilePrepaid`, `usePayoutForm`
- Distinguish from **Orchestration Hooks** (`usePayoutFlow`): those chain sequential async steps; ViewModel Hooks own screen state
- Setters that do more than `setState` (e.g. also clear a sibling field) use a verb prefix: `selectBeneficiary` not `setSelectedBeneficiary`

### Component Side

```tsx
function MyScreenInner({ accountId }: { accountId: string }) {
  const { cards, isLoading, selectedCard, setSelectedCard, submit, isSubmitting } =
    useMyFeature(accountId);

  if (isLoading) return <LoadingState />;
  // pure render from here — no useState, no logic
}
```

The outer shell component resolves `accountId` (from auth/session) and renders `<MyScreenInner>` — keeps session concerns outside the ViewModel Hook entirely.

---

## Universal Insights

- `useFocusEffect` not `useEffect` for hooks that need refresh on navigation back
- Seed data must be **upserted** (not just seeded when null) — `loadAccounts()` and `loadCards()` check by id and insert missing seeds
- SonarQube detects literal password strings as "hard-coded credential" — construct from array join or use `NOSONAR` comment
- ESLint "mark props as read-only" warning is pre-existing across codebase — not a new error
- Test date ranges use `.getDate()/.getMonth()` (local time) not `.getUTCDate()` — CI timezone differs from local
- Shell backtick escaping in `node -e` can drop lines with `!` (bash history expansion) — use `node -p` or write file via separate JS script
