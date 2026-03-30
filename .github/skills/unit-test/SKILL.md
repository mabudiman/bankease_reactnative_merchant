---
name: unit-test
description: 'Write unit tests for this React Native / Expo project. Use when creating or updating test files for API functions, React Query hooks, React Native components, services with AsyncStorage, or pure utility functions. Follows project conventions: Jest + jest-expo + @testing-library/react-native, MSW via jest.setup.js, createWrapper() from test-utils, MOCK_* constants from mocks/data, 90% minimum code coverage.'
argument-hint: 'Describe what to test: file path, or feature + category (api | hook | component | service | utils)'
---

# Unit Test

## When to Use
- Adding tests for a new feature module (API, hook, component, service, or util)
- Increasing code coverage to meet the 90% threshold
- Verifying a bug fix is stable

## Coverage Requirement
**Minimum 90% line/branch/function coverage** for every file being tested.
Run `npm test -- --coverage --collectCoverageFrom="<path>"` to verify before finishing.

---

## Test Category Cheat Sheet

| Subject | Import pattern | Wrapper needed? | MSW auto-active? |
|---------|---------------|-----------------|-----------------|
| API function (`features/*/api/`) | Import function directly | No | ✅ Yes |
| React Query hook (`features/*/hooks/`) | `renderHook` + `waitFor` | ✅ Yes (`createWrapper`) | ✅ Yes |
| React Native component | `render` + `screen` | ✅ Yes (`createWrapper`) | ✅ Yes |
| Service w/ AsyncStorage | `jest.mock(AsyncStorage)` | No | N/A |
| Pure util (`utils/`) | Import function directly | No | N/A |

---

## Project Conventions

### Path alias
Always use `@/` — configured in `tsconfig.json` + `jest.config.js`.

### Test file location
Colocate in a `__tests__/` folder next to the source file:
```
features/foo/api/__tests__/foo-api.test.ts
features/foo/hooks/__tests__/foo-hooks.test.ts
features/foo/components/__tests__/FooCard.test.tsx
features/foo/services/__tests__/foo-service.test.ts
```

### Wrapper
```ts
import { createWrapper } from '@/test-utils/createWrapper';

const { Wrapper } = createWrapper();
renderHook(() => useMyHook(), { wrapper: Wrapper });
render(<MyComponent />, { wrapper: Wrapper });
```

### Mock data
Always import from `@/mocks/data` — never use magic numbers or inline data if a `MOCK_*` constant exists:
```ts
import { MOCK_EXCHANGE_RATES, MOCK_BRANCHES } from '@/mocks/data';
```

### MSW
MSW handlers are registered globally in `jest.setup.js` → `mocks/server.node.ts` → `mocks/handlers.ts`.
**No per-test MSW setup is needed.** Just call the API function.

---

## Procedure

### 1 — API Function Test

```ts
// features/foo/api/__tests__/foo-api.test.ts
import { getFoo } from '../index';
import { MOCK_FOO } from '@/mocks/data';

describe('getFoo', () => {
  it('returns all entries', async () => {
    const result = await getFoo();
    expect(result).toHaveLength(MOCK_FOO.length);
  });

  it('each item has required fields', async () => {
    const result = await getFoo();
    for (const item of result) {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
      });
    }
  });

  it('returns data matching first mock entry', async () => {
    const result = await getFoo();
    expect(result[0]).toMatchObject({ id: MOCK_FOO[0].id });
  });
});
```

**Checklist for API tests:**
- [ ] Test total count matches `MOCK_*` length
- [ ] Test field shape with `toMatchObject` + `expect.any(Type)`
- [ ] Test filter/query param paths (empty, matching, non-matching, case-insensitive)
- [ ] Test first item matches `MOCK_*[0]` to confirm data integrity

---

### 2 — React Query Hook Test

```ts
// features/foo/hooks/__tests__/use-foo.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';
import { createWrapper } from '@/test-utils/createWrapper';
import { useFoo } from '../index';
import { MOCK_FOO } from '@/mocks/data';

describe('useFoo', () => {
  it('starts in loading state', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useFoo(), { wrapper: Wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('fetches data successfully', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useFoo(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(MOCK_FOO.length);
  });

  it('returns correct first item', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useFoo(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data![0].id).toBe(MOCK_FOO[0].id);
  });
});
```

**Checklist for hook tests:**
- [ ] Test initial loading state (synchronous assertion — no `await`)
- [ ] Test successful data shape using `waitFor(() => isSuccess)`
- [ ] Test that query key changes trigger re-fetch (if hook accepts params)
- [ ] Always create a **fresh** `createWrapper()` per `it` block

---

### 3 — React Native Component Test

```tsx
// features/foo/components/__tests__/FooCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FooCard } from '../FooCard';
import { createWrapper } from '@/test-utils/createWrapper';
import { MOCK_FOO } from '@/mocks/data';

const SAMPLE = MOCK_FOO[0];

describe('FooCard', () => {
  it('renders the title', () => {
    const { Wrapper } = createWrapper();
    render(<FooCard item={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByText(SAMPLE.title)).toBeOnTheScreen();
  });

  it('has accessibilityRole button', () => {
    const { Wrapper } = createWrapper();
    render(<FooCard item={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByRole('button')).toBeOnTheScreen();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { Wrapper } = createWrapper();
    render(<FooCard item={SAMPLE} onPress={onPress} />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not throw when optional onPress is omitted', () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<FooCard item={SAMPLE} />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
```

**Checklist for component tests:**
- [ ] Test all visible text (title, subtitle, value labels)
- [ ] Test `accessibilityRole` via `getByRole`
- [ ] Test `accessibilityLabel` via `getByLabelText` (if set)
- [ ] Test `onPress` / `onRetry` callbacks with `jest.fn()` + `fireEvent.press`
- [ ] Test optional props do not throw
- [ ] Use `MOCK_*` data for `SAMPLE` constant — define once above `describe`

---

### 4 — Service with AsyncStorage Test

```ts
// features/foo/services/__tests__/foo-service.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fooService } from '../foo-service';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

function setupEmptyStorage() {
  mockGetItem.mockResolvedValue(null);
  mockSetItem.mockResolvedValue(undefined);
}

function setupStorageWith(key: string, value: unknown) {
  mockGetItem.mockImplementation(async (k: string) =>
    k === key ? JSON.stringify(value) : null
  );
  mockSetItem.mockResolvedValue(undefined);
}

describe('fooService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('load', () => {
    it('seeds data on first load when storage is null', async () => {
      setupEmptyStorage();
      const result = await fooService.load('demo-001');
      expect(result).toBeDefined();
      expect(mockSetItem).toHaveBeenCalled();
    });

    it('returns stored value when it exists', async () => {
      const stored = [{ id: 'x', accountId: 'demo-001' }];
      setupStorageWith('@foo:items', stored);
      const result = await fooService.load('demo-001');
      expect(result).toHaveLength(1);
    });

    it('does not duplicate on subsequent calls (upsert by id)', async () => {
      setupEmptyStorage();
      const firstResult = await fooService.load('demo-001');
      // Re-setup storage simulating what was just written
      setupStorageWith('@foo:items', firstResult);
      const callsBefore = mockSetItem.mock.calls.length;
      await fooService.load('demo-001');
      expect(mockSetItem.mock.calls.length).toBe(callsBefore);
    });
  });
});
```

**Checklist for service tests:**
- [ ] Mock AsyncStorage at the top of the file (`jest.mock(...)`)
- [ ] Create `setupEmptyStorage()` and `setupStorageWith(key, value)` helper functions
- [ ] Call `jest.clearAllMocks()` in `beforeEach`
- [ ] Test first-load seed behavior (storage returns `null`)
- [ ] Test upsert — no duplicates on second call
- [ ] Test per-account key isolation (different accountIds → different keys)
- [ ] Test stored value is returned when it exists
- [ ] Check `mockSetItem` call count and arguments to verify writes

---

### 5 — Pure Utility Test

```ts
// utils/__tests__/foo.test.ts
import { myUtil } from '@/utils/foo';

describe('myUtil', () => {
  it('handles normal input', () => {
    expect(myUtil('hello')).toBe('HELLO');
  });

  it('returns empty string for empty input', () => {
    expect(myUtil('')).toBe('');
  });

  it('handles edge case (null-like)', () => {
    expect(myUtil('  ')).toBe('');
  });
});
```

**Checklist for util tests:**
- [ ] Test happy path
- [ ] Test empty / zero / null-like inputs
- [ ] Test boundary values (15 chars, 34 chars for IBAN etc.)
- [ ] Test invalid / error path returns expected default
- [ ] Use `jest.useFakeTimers()` + `jest.setSystemTime()` for date-dependent utils

---

## Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| `describe` (outer) | entity/function name | `describe('useBranches', ...)` |
| `describe` (inner) | method or scenario | `describe('signIn', ...)` |
| `it` | plain English, starts with verb | `'returns all entries'` |
| `SAMPLE` const | `MOCK_*[0]` or specific index | `const SAMPLE = MOCK_BRANCHES[0]` |

---

## Anti-Patterns to Avoid

- ❌ Magic numbers or inline mock objects when a `MOCK_*` constant exists — use `MOCK_*`
- ❌ Sharing one `createWrapper()` across multiple `it` blocks — create fresh per test
- ❌ Calling `await waitFor(...)` on the loading-state test — it should assert synchronously
- ❌ Calling services directly in component tests — mock or let MSW handle it
- ❌ Using `getByTestId` as primary selector — prefer `getByText`, `getByRole`, `getByLabelText`
- ❌ Per-test MSW server setup — handlers are global via `jest.setup.js`
- ❌ Asserting on `data` without first checking `isSuccess` in hook tests
- ❌ Testing implementation details (internal state, private methods)

---

## Running Tests

```bash
# Run all tests
npm test

# Run specific file
npm test -- features/foo/api/__tests__/foo-api.test.ts

# Run with coverage report
npm test -- --coverage

# Watch mode
npm run test:watch
```
