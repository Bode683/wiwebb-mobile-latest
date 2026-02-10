# wiwebb

Expo Router app with i18n (react-i18next) and MMKV storage.

## Stack

- Expo SDK 54, React Native 0.81.5, New Architecture enabled
- expo-router v6, React 19
- react-native-mmkv v4 + react-native-nitro-modules v0.33+
- i18next v25 + react-i18next v16

## i18n

- Config: `src/i18n/index.ts`
- Language detector (uses MMKV to persist): `src/i18n/languageDetector.ts`
- Locale files: `src/i18n/locales/{en,fr}/{common,onboarding,Home}.json`
- MMKV instance: `src/mmkv/index.ts`
- Initialized in: `src/app/_layout.tsx` via `import '../i18n'`
- Languages: `en` (default), `fr`

### Usage

**Rule:** Always pass the namespace to `useTranslation()` and use bare keys — never the `namespace:key` prefix form.

```ts
// ✅ Correct
const { t } = useTranslation('Home');
t('homepage.welcome')
t('usersList.title')

// ❌ Avoid
const { t } = useTranslation();
t('Home:homepage.welcome')
```

---

## Redux

- Store: `src/store/index.ts`
- Typed hooks: `src/store/hooks.ts`
- Slices: `src/store/slices/{message,users,colors}.ts`
- Persistence: `redux-persist` + MMKV adapter at `src/store/storage.ts`
- `Provider` + `PersistGate` in `src/app/_layout.tsx`

### Persisted slices
Only `message` is persisted. `users` re-fetches on mount; `colorsApi` is managed by RTK Query.

### Usage

```ts
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setMessage } from '@/src/store/slices/message';
import { useGetColorsQuery } from '@/src/store/slices/colors';
import { fetchUsers, selectAllUsers } from '@/src/store/slices/users';

// Read state
const { message } = useAppSelector(state => state.message);

// Dispatch action
const dispatch = useAppDispatch();
dispatch(setMessage('hello'));

// RTK Query
const { data, isFetching, error } = useGetColorsQuery();
```

### Adding a new slice
1. Create `src/store/slices/mySlice.ts` using `createSlice`
2. Add its reducer to `combineReducers` in `src/store/index.ts`
3. Add to `whitelist` in `persistConfig` only if it needs persistence

---

## Theme

- All tokens: `src/theme/` — `colors.ts`, `typography.ts`, `spacing.ts`, `animations.ts`
- Provider + `useTheme` hook: `src/theme/ThemeProvider.tsx`
- Barrel export: `src/theme/index.ts`
- Colour scheme persisted in MMKV key `app-color-scheme` via `src/mmkv/index.ts`
- Wrapped in `src/app/_layout.tsx` inside `<ThemeProvider>`
- Palette: amber primary (`#f59e0b`), neutral surfaces, MD3 structure + sidebar/chart extensions

### Usage

```tsx
import { useTheme, typography, spacing, borderRadius, shadows, spring } from '../theme';

// Colours (responds to light/dark)
const { theme, colorScheme, isDark, toggleTheme, setColorScheme } = useTheme();
<View style={{ backgroundColor: theme.background }}>
<Text style={{ color: theme.onBackground }}>Hello</Text>

// Typography variants (MD3 type scale)
<Text style={typography.variants.bodyLarge}>Body text</Text>
<Text style={[typography.variants.titleMedium, { color: theme.primary }]}>Title</Text>

// Spacing (4pt grid)
paddingHorizontal: spacing.md   // 16
gap: sp(3)                      // 12  (sp = arbitrary multiple helper)

// Border radius (base = 6px matching --radius: 0.375rem)
borderRadius: borderRadius.md   // 6   (default component radius)
borderRadius: borderRadius.lg   // 10

// Shadows
style={[styles.card, shadows.sm]}

// Named spring animations (Reanimated)
scale.value = spring(1.2, 'bouncy');  // presets: gentle | bouncy | stiff | slow | snap
opacity.value = spring(0, 'snap');
```

### Colour token cheatsheet

| Token | Light | Dark | Use |
|---|---|---|---|
| `primary` | `#f59e0b` | `#f59e0b` | Buttons, links, active state |
| `onPrimary` | `#000` | `#000` | Text on primary |
| `primaryContainer` | `#fffbeb` | `#92400e` | Accent backgrounds |
| `onPrimaryContainer` | `#92400e` | `#fde68a` | Text on accent bg |
| `background` | `#fff` | `#171717` | Screen background |
| `surface` | `#fff` | `#262626` | Card / sheet background |
| `onSurface` | `#262626` | `#e5e5e5` | Primary text |
| `onSurfaceVariant` | `#6b7280` | `#a3a3a3` | Secondary / muted text |
| `outline` | `#e5e7eb` | `#404040` | Borders, dividers |
| `sidebar` | `#f9fafb` | `#0f0f0f` | Drawer / tab bar background |
| `sidebarPrimary` | `#f59e0b` | `#f59e0b` | Active drawer/tab item |
| `sidebarAccent` | `#fffbeb` | `#92400e` | Active item background |
| `error` | `#ef4444` | `#ef4444` | Destructive actions |

### Font loading (optional)

Fonts `Inter`, `SourceSerif4`, `JetBrainsMono` are registered in `typography.fonts` but fall back to system fonts until loaded. To enable them:

```bash
npx expo install @expo-google-fonts/inter @expo-google-fonts/source-serif-4 @expo-google-fonts/jetbrains-mono
```

Then in `src/app/_layout.tsx`:
```tsx
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
// load with useFonts({ Inter_400Regular, ... }) and gate render on fontsLoaded
```

---

## Issues & Fixes

### 1. react-native-mmkv v4 API Change
**Problem:** `import { MMKV } from 'react-native-mmkv'` + `new MMKV({...})` caused `TypeError: Cannot read property 'prototype' of undefined` because v4 removed the `MMKV` class.

**What didn't work:** Adding `@ts-ignore`, checking autolinking, version pinning.

**Fix:** Use the new v4 API everywhere MMKV is instantiated (app storage, redux-persist storage, etc.):
```ts
// Before (v3)
import { MMKV } from 'react-native-mmkv';
export const mmkvStorage = new MMKV({ id: 'user-starter-storage' });

// After (v4)
import { createMMKV } from 'react-native-mmkv';
export const mmkvStorage = createMMKV({ id: 'user-starter-storage' });
```

### 2. i18next v25 Compatibility
**Problem:** `compatibilityJSON: 'v3'` was removed in i18next v25, `useSuspense: true` required a `<Suspense>` boundary, and `defaultTransParent: Text` caused prototype errors.

**Fix:** Clean up `src/i18n/index.ts`:
- Remove `compatibilityJSON: 'v3'`
- Set `useSuspense: false`
- Remove `defaultTransParent: Text`
- Add all namespaces to the `ns` array: `['common', 'Header', 'Homepage', ...]`

### 3. NitroModules Not Found (before rebuild)
**Problem:** `Error: Failed to get NitroModules` — native module not linked.

**Fix:** Run a full native rebuild (not just Metro restart):
```bash
npx expo prebuild --clean
npx expo run:android   # or run:ios
```

---

## ADB Debugging

### View live logs
```bash
adb logcat | grep "ReactNativeJS"
```

### Filter by severity
```bash
# Errors and warnings only
adb logcat | grep -E "E ReactNativeJS|W ReactNativeJS"

# Native layer (NitroModules, JSI, etc.)
adb logcat | grep -E "NitroModules|Nitro\."
```

### Clear logs and capture fresh run
```bash
adb logcat -c
adb shell am force-stop com.barnesjack.wiwebb
adb shell am start -n com.barnesjack.wiwebb/.MainActivity
sleep 5
adb logcat -d | grep "ReactNativeJS"
```

### Take a screenshot
```bash
adb exec-out screencap -p > screenshot.png
```

### Check if Metro is running
```bash
curl http://localhost:8081/status
# Expected: packager-status:running
```

### Verify native module is registered
```bash
adb logcat | grep "Nitro.HybridObjectRegistry"
# Should show: Successfully registered HybridObject "MMKVFactory"
```
