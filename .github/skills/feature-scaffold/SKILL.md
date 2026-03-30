---
name: feature-scaffold
description: 'Scaffold a new feature module in this Expo project. Use when adding new feature folders, API functions, hooks, components, services, or locale registrations under features/. Covers folder structure, barrel exports, i18n registration, and TanStack Query key setup.'
argument-hint: 'Name of the new feature to scaffold, e.g. "beneficiaries" or "notifications"'
---

# Feature Scaffold

## When to Use
- Creating a brand-new feature module under `features/`
- Adding API, hooks, components, services, or locales to an existing feature
- Registering a new feature's locale files in the i18n system

---

## Folder Structure

Every feature lives in `features/<feature-name>/` with this layout:

```
features/<feature-name>/
├── types.ts              # TypeScript interfaces for the domain
├── api/
│   ├── index.ts          # API call functions (barrel export)
│   └── __tests__/        # API unit tests
├── components/
│   ├── index.ts          # Barrel export for all components
│   └── __tests__/        # Component unit tests
├── hooks/
│   ├── index.ts          # Barrel export for hooks
│   └── __tests__/        # Hook unit tests
├── services/
│   ├── index.ts          # Business logic / service layer
│   └── __tests__/        # Service unit tests
└── locales/
    ├── en.json           # English translations (flat dotted keys)
    └── id.json           # Indonesian translations (flat dotted keys)
```

---

## Step-by-Step Procedure

### 1 — Create types

```ts
// features/<name>/types.ts
export interface FooItem {
  id: string;
  name: string;
  // domain-specific fields
}
```

### 2 — Create API layer

Use `core/api/client.ts` for HTTP requests:

```ts
// features/<name>/api/index.ts
import { request } from '@/core/api/client';
import type { FooItem } from '../types';

export async function getFoo(): Promise<FooItem[]> {
  return request<FooItem[]>('/api/foo');
}
```

- Extend `core/api/errors.ts` if the feature introduces new error types
- Add MSW handler in `mocks/handlers.ts` for the new endpoint
- Add mock data constant (`MOCK_FOO`) in `mocks/data.ts`

### 3 — Create hooks

```ts
// features/<name>/hooks/index.ts
import { useQuery } from '@tanstack/react-query';
import { getFoo } from '../api';
import type { FooItem } from '../types';

export function useFoo() {
  return useQuery<FooItem[]>({
    queryKey: ['foo'],
    queryFn: getFoo,
  });
}
```

- Add a new unique query key — do not reuse existing keys
- If the hook needs to refresh on screen focus, use `useFocusEffect` + `useCallback` instead of `useEffect`

### 4 — Create components

```tsx
// features/<name>/components/FooCard.tsx
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import type { FooItem } from '../types';

interface Props {
  item: FooItem;
  onPress?: () => void;
}

export function FooCard({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={item.name}>
      <ThemedView style={styles.card}>
        <ThemedText>{item.name}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}
```

- Use `ThemedText` / `ThemedView` for dark mode support
- User-facing text must go through i18n (`useTranslation` hook)
- Use `Pressable` (not `TouchableOpacity`) as the standard tap handler

### 5 — Create locales

```json
// features/<name>/locales/en.json
{
  "title": "Foo Feature",
  "empty": "No items found"
}
```

```json
// features/<name>/locales/id.json
{
  "title": "Fitur Foo",
  "empty": "Tidak ada item"
}
```

**Key format**: flat dotted keys (`"card.title": "..."`) — compatible with `flattenWithPrefix` in `app/_i18n.ts`.

### 6 — Register locales in i18n

In `app/_i18n.ts`, add the import and register in the translations merge:

```ts
import fooEn from '@/features/<name>/locales/en.json';
import fooId from '@/features/<name>/locales/id.json';

// Inside the merge:
...flattenWithPrefix('foo', locale === 'en' ? fooEn : fooId),
```

### 7 — Add route

Create the screen in `app/` as a thin routing layer:

```tsx
// app/(tabs)/<name>.tsx  OR  app/<name>/index.tsx
import { FooScreen } from '@/features/<name>/components/FooScreen';
export default function FooRoute() {
  return <FooScreen />;
}
```

- Keep business logic in features, not in `app/` route files

---

## Checklist

- [ ] `features/<name>/types.ts` created
- [ ] `features/<name>/api/index.ts` with barrel export
- [ ] `features/<name>/hooks/index.ts` with TanStack Query hook
- [ ] `features/<name>/components/` with at least one component
- [ ] `features/<name>/services/` if business logic needed (AsyncStorage, transforms etc.)
- [ ] `features/<name>/locales/en.json` + `id.json` with flat dotted keys
- [ ] Locales registered in `app/_i18n.ts`
- [ ] MSW handler added in `mocks/handlers.ts`
- [ ] Mock data added in `mocks/data.ts`
- [ ] Route file created in `app/`
- [ ] Query key is unique and does not collide with existing keys
