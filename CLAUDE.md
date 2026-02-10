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
