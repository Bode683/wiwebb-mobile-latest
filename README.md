# wiwebb

React Native admin app for managing Wiweeb Cloud Platform WiFi networks. Built with Expo SDK 54, New Architecture, and file-based routing via expo-router.

## Stack

| Layer      | Library                                                     |
| ---------- | ----------------------------------------------------------- |
| Navigation | expo-router v6 (drawer → tabs → stack)                      |
| State      | Redux Toolkit 2 + redux-persist                             |
| Network    | RTK Query (injected into a single `baseApi`)                |
| Storage    | react-native-mmkv v4                                        |
| i18n       | i18next v25 + react-i18next v16                             |
| Theme      | Custom `src/theme/` (amber, MD3 tokens, Reanimated springs) |
| UI         | react-native-paper + react-native-reanimated 4              |

## Getting started

```bash
npm install
npx expo run:android   # or run:ios  (native build required for MMKV)
```

> `npx expo start` (Expo Go) will not work — MMKV requires a native build.

Set the API base URL in `.env` before running:

```
EXPO_PUBLIC_API_URL=http://<host>:4011/api/v1
```

Use `10.0.2.2` for Android emulator or the LAN IP for a physical device.
The mock stack must be running (see **Mock server** below).

## Project structure

```
src/
├── app/                   # File-based routes (expo-router)
│   ├── (auth)/            # Login, sign-up, welcome
│   ├── (onboarding)/      # First-run org setup wizard
│   ├── (public)/          # Unauthenticated routes (invite accept)
│   └── (drawer)/          # Main app: tabs + all admin sections
│       ├── (tabs)/        # Dashboard, settings
│       ├── users/         # User list, invite, detail
│       ├── geographic-info/  # Sites list, form, detail
│       └── ...            # devices, organizations, subscriptions, …
├── components/            # AppIcon, DrawerContent, TabBar, …
├── features/
│   ├── auth/              # authApi, authSlice, RBAC, mockAuth
│   ├── organizations/     # organizationApi, organizationSlice
│   ├── sites/             # sitesApi, useOrgSites
│   └── users/             # usersApi, useOrgUsers
├── theme/                 # Colors, typography, spacing, ThemeProvider
├── store/                 # Redux store, slices, typed hooks, baseApi
├── i18n/                  # Config + EN/FR locale files
└── mmkv/                  # Shared MMKV instance
```

## Authentication

Login is credential-based (`POST /users/token/`). The returned JWT is stored in MMKV and attached as a Bearer token on every request via `baseApi`. On restart, `bootstrap()` re-fetches `/auth/me/` to rehydrate the session.

In dev, `MOCK_AUTH_ENABLED = __DEV__` skips real Keycloak OAuth but still hits the network — credentials select which of the four role accounts you get (see **Demo credentials** below).

## RBAC — two authorization axes

Authorization is the intersection of **role** and **tenant membership**.

### Role axis

Derived from the OpenWISP boolean combo (`is_superuser` / `is_staff` / `org.is_admin`):

| Display role         | is_superuser | is_staff | org.is_admin | Can write                                                      |
| -------------------- | :----------: | :------: | :----------: | -------------------------------------------------------------- |
| Super Admin          |      ✓       |    ✓     |      ✓       | Everything                                                     |
| Super Admin Delegate |      —       |    ✓     |      ✓       | Everything except org ownership transfer                       |
| Admin                |      —       |    —     |      ✓       | Platform config, devices, plans, users (not roles above Admin) |
| Viewer               |      —       |    —     |      —       | Read-only                                                      |

`deriveRole(user)` maps booleans → display role. `can(user, action)` checks the minimum role for an action. Use `<RoleGate action="...">` to gate UI affordances and `useCan(action)` in hooks.

### Tenant axis

A user may belong to multiple organizations. `memberOrgIds(user)` returns their memberships. The **active organization** (stored in `organizationSlice`) scopes every list query and stamps every create. Superusers bypass tenant scoping and see all orgs.

## Demo credentials

The mock accepts any password; the username selects the role account:

| Username     | Role                 | Orgs                      |
| ------------ | -------------------- | ------------------------- |
| `superadmin` | Super Admin          | Sees all (member of Acme) |
| `delegate`   | Super Admin Delegate | Acme + TechWave           |
| `admin`      | Admin                | Acme only                 |
| `viewer`     | Viewer               | TechWave (read-only)      |

## Mock server

The dev mock runs at `:4011` (Mockoon CLI proxied to Prism at `:4010`).

```bash
cd mock-servers/openwisp-mockoon
docker compose up -d
```

Seed scripts apply changes to `openwisp-mock.json` and restart the container:

| Script                   | Phase | What it seeds                                               |
| ------------------------ | ----- | ----------------------------------------------------------- |
| `apply_rbac_accounts.py` | 0     | 4 role accounts, credential-keyed token + auth/me           |
| `apply_users_phase1.py`  | 1     | usr1 users with status + invite_token, org_users as list    |
| `apply_sites_phase2.py`  | 2     | loc1 sites (controller/location) with CRUD + paginated list |

> **Mockoon `rootChildren` rule:** Routes added to `routes[]` must also be added to `rootChildren[]` (as `{"type":"route","uuid":"..."}`) or Mockoon CLI silently ignores them. All seed scripts manage this automatically.

## Languages

English (`en`) and French (`fr`). Locale files in `src/i18n/locales/{en,fr}/`. Namespaces: `common`, `auth`, `onboarding`, `Home`, `settings`, `users`, `sites`.

## Docs

See `CLAUDE.md` for i18n usage rules, Redux patterns, theme API, and known fixes.
See `tasks/plan.md` for the full implementation plan (Phases 0–6).
See `tasks/todo.md` for current progress.
