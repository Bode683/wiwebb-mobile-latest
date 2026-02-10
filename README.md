# wiwebb

React Native app built with Expo SDK 54, New Architecture, and file-based routing via expo-router.

## Stack

| Layer | Library |
|---|---|
| Navigation | expo-router v6 (drawer → tabs → stack) |
| State | Redux Toolkit 2 + redux-persist |
| Storage | react-native-mmkv v4 |
| i18n | i18next v25 + react-i18next v16 |
| Theme | Custom `src/theme/` (amber, MD3 tokens, Reanimated springs) |
| UI | react-native-paper + react-native-reanimated 4 |

## Getting started

```bash
npm install
npx expo run:android   # or run:ios  (native build required for MMKV)
```

> `npx expo start` (Expo Go) will not work — MMKV requires a native build.

## Project structure

```
src/
├── app/          # File-based routes (expo-router)
│   ├── (auth)/   # Login, sign-up, welcome
│   └── (drawer)/ # Main app: tabs + settings + explore
├── components/   # TabBar, DrawerContent
├── theme/        # Colors, typography, spacing, animations, ThemeProvider
├── store/        # Redux store, slices, typed hooks
├── i18n/         # Config + EN/FR locale files
└── mmkv/         # Shared MMKV instance
```

## Languages

English (`en`) and French (`fr`). Locale files in `src/i18n/locales/{en,fr}/`.

## Docs

See `CLAUDE.md` for i18n usage rules, Redux patterns, theme API, and known fixes.
