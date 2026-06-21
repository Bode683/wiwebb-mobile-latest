# Wiweeb RBAC + Multi-Tenant Admin — Implementation Plan

> Scope: everything we agreed on **except the captive portal**, which is built
> immediately after this plan completes. This plan covers the **admin
> (configuration) plane** only. The portal (consumption plane) is a separate
> effort.

## Guiding principles

1. **Backend-driven, no hardcoded data in the app.** Every entity (users,
   orgs, sites, devices, plans, payment methods) is seeded in the Mockoon
   stack and pulled via RTK Query. Swapping the real backend = changing the
   base URL only.
2. **Promote, don't seed-in-place.** Any route a feature reads/writes
   meaningfully is lifted from Prism's generic floor into a Mockoon data
   bucket + CRUD route. Everything else keeps falling through to Prism.
3. **Separate credentials per role** (not a dev toggle). Logging in as each
   role exercises the full `users/token/` → `/auth/me/` → role → gated-UI
   chain.
4. **Role is a first-class UI concept**, mapped to the OpenWISP
   `is_superuser` / `is_staff` / `organization_users.is_admin` combination
   under the hood, so the UI stays clean and the mapping is the only thing
   that changes for a real backend.
5. **Vertical slices.** Each task lands one complete path (mock → app → verify),
   not a horizontal layer.

## Environment facts (verified)

- Mock stack is **already running**: Mockoon `:4011` (proxy, strips `api/v1`)
  → Prism `:4010`. Config at `/home/nkem/Desktop/itlds/mock-servers`.
- Mockoon `endpointPrefix: api/v1`; existing buckets: `org1`, `usr1`, `grp1`.
- `GET /api/v1/auth/me/` currently returns one hardcoded superuser (Alice).
- App currently **bypasses the network for identity** — `mockAuth.ts` injects
  a hardcoded `MOCK_USER`; `/auth/me/` is never called in dev.
- `baseApi` base URL = `EXPO_PUBLIC_API_URL ?? https://api.wiweeb.com` (no dev
  override yet).

## Role → OpenWISP mapping (single source of truth)

| Display role            | is_superuser | is_staff | org_user.is_admin | Can write |
|-------------------------|:------------:|:--------:|:-----------------:|-----------|
| Super Admin (owner)     | ✓            | ✓        | ✓                 | everything |
| Super Admin Delegate    | —            | ✓        | ✓                 | everything except org ownership transfer |
| Admin                   | —            | —        | ✓                 | platform config, devices, plans, users (not roles above Admin) |
| Viewer                  | —            | —        | —                 | nothing (read-only) |

A `deriveRole(user)` helper computes the display role from these booleans;
`can(action)` maps actions → minimum role.

## Two authorization axes (role × tenant)

Authorization has **two orthogonal axes**. Effective permission =
**role ∩ tenant membership**.

| Axis | Question | Mechanism |
|------|----------|-----------|
| **Role** | *What* can you do? | `deriveRole(user)` → `can(role, action)` |
| **Tenant scope** | *Which* tenants' assets? | membership list + active-org filter |

- This is **multi-tenant**: an admin may belong to several tenants
  (organizations) and may manage only those — never tenants they don't
  belong to.
- A **superuser** (Super Admin / owner) **bypasses tenant scoping** and sees
  all tenants. A regular Admin/Delegate/Viewer is scoped to their member orgs.
- Membership lives in `User.organization_users` — which must be a **list** of
  `{organization, is_admin, is_owner}` (real OpenWISP shape), not the single
  object currently in `types/api.ts`.
- The **active organization** (already in `organizationSlice` +
  `(modals)/orgSelect.tsx`) is the single point of scope. Every scoped list
  query filters by it; every create stamps it. The query param
  (`?organization=<activeOrgId>`) is the swappable seam — the real backend
  will enforce the same scoping server-side from the token.

## Impact on existing features (what must change, and where)

These are concrete collisions between the plan and code that already exists.
Each must be handled in the phase noted, or it will break.

### A. `AuthBootstrap` — BREAKS on the org_users list change
`src/features/auth/components/AuthBootstrap.tsx` reads
`user?.organization_users?.is_admin === true` (single object). Task 0.6 makes
`organization_users` a **list**, so this expression goes `undefined` and the
onboarding gate misfires.
- **Change (Phase 0):** replace the `ownsOrg` check with the new helper —
  `isAnyOrgAdmin(user)` / `memberOrgIds(user).length > 0` from `rbac.ts`.
- **Routing decisions** stay in `AuthBootstrap` (per the existing design) but
  now consume backend-derived membership instead of a single boolean.

### B. Onboarding gate + onboarding writes nothing to the backend
`onboardingSlice` is **local-only** — it stores `orgName`/`wifiConfigs` in
Redux and never creates a real org/site. Gating uses local `onboardingCompleted`
+ `ownsOrg`.
- **New meaning of the gate (Phase 0/1):** a user who belongs to **no org**
  (`memberOrgIds(user).length === 0`) is sent to onboarding to **create their
  first tenant**; a user who already belongs to ≥1 org skips it. Drop the
  reliance on the local `onboardingCompleted` flag as the source of truth
  (keep it only as a UI convenience).
- **OrgSetupStep must POST to the backend (Phase 1/2):** creating the org →
  `POST /users/organization/` (org1 bucket); the WiFi/site step →
  `POST controller/location` (loc1, Phase 2). The created org becomes the
  user's first membership and the active org. Until those endpoints exist,
  onboarding stays local and is wired up when Phase 1/2 land.
- **`SuccessStep`/`completeOnboarding`** should set the **active organization**
  to the newly created org.

### C. Active-organization defaulting + membership filtering
`activeOrganizationId` starts `null` and is only set via the modal.
`DrawerContent` and `orgSelect` call `useGetOrganizationsQuery()` which lists
**all** orgs unfiltered.
- **Change (Task 0.6):** on login/bootstrap, default `activeOrganizationId` to
  the user's first member org. Filter the org list shown in
  `DrawerContent` (`src/components/DrawerContent.tsx:241`) and `orgSelect`
  (`src/app/(modals)/orgSelect.tsx`) to **member orgs** (superuser sees all).

### D. Payment flow — current screens are END-USER concerns, must be re-scoped
Two existing pieces conflict with the agreed admin/portal split:

1. **`subscriptions/plans.tsx` is currently a guest *subscribe/checkout*
   screen** — it lets you pick a tier+duration and "confirm" against a default
   payment method (`selectDefaultPaymentMethod`, lines 88/202). Per our
   decision, **end users subscribe via the captive portal, not the admin app.**
   - **Change (Phase 4):** repurpose `plans.tsx` from subscribe/checkout into
     **admin plan configuration** (create/edit/activate FPU & PPU plans). The
     subscribe/checkout UX is **moved to the captive portal** (next effort) —
     lift the tier/duration/confirm UI out, don't delete it; it's the portal's
     starting point.

2. **`store/slices/paymentMethods.ts` + `settings/payment-methods.tsx` model a
   *user's saved payment instruments*** (local Redux/MMKV: card numbers, phone
   numbers, a default). That is an **end-user/portal** concept, not admin
   provider config.
   - **Change (Phase 5):** the admin screen we add is **provider enablement**
     (`pay1`: which providers a tenant accepts), backend-backed and
     org-scoped — a **separate** screen from the personal-instrument one.
   - Keep `paymentMethods` slice + `settings/payment-methods.tsx` as-is for
     now (harmless), but document that it belongs to the portal/end-user side
     and is **not** the admin provider config. Revisit when the portal is
     built — it likely moves there.

### E. Login screen — credentials now matter
`(auth)/login.tsx` works unchanged, but `login()` currently calls `mockLogin`
which ignores credentials. After Task 0.3 the email/username selects which of
the 4 role accounts you get. No UI change; add demo-credential hints if useful.

### F. RTK Query base URL
`baseApi` defaults to `https://api.wiweeb.com`. Task 0.1 sets
`EXPO_PUBLIC_API_URL` to the LAN mock — no code change beyond the env var, but
note Mockoon's `endpointPrefix: api/v1` means the var **includes** `/api/v1`.

### Summary table

| Existing artifact | Phase | Action |
|---|---|---|
| `AuthBootstrap.tsx` (`organization_users.is_admin`) | 0 | Rewrite gate with `rbac` helpers (list-aware) |
| `onboardingSlice` + `OrgSetupStep` | 0→2 | Gate on membership; POST org/site to backend |
| `DrawerContent.tsx` / `orgSelect.tsx` org list | 0.6 | Filter to member orgs; default active org |
| `subscriptions/plans.tsx` | 4 | Re-scope: admin plan config; checkout → portal |
| `paymentMethods` slice + settings screen | 5 | Keep; mark as portal/end-user; add separate admin provider config |
| `(auth)/login.tsx` / `mockAuth` | 0 | Real token POST; credentials select role |
| `baseApi` base URL | 0.1 | Env var only |

## Dependency graph

```
Phase 0  Backend-driven identity + RBAC core   ← everything depends on this
   │
   ├── Phase 1  Users · Invite · Assign roles
   ├── Phase 2  Sites (controller/location)
   ├── Phase 3  Devices + adoption workflow
   │
   └── Phase 4  Plans (FPU/PPU) admin config
          │
          ├── Phase 5  Payment methods admin config
          └── Phase 6  Orders + Payments (reporting, read-only)

(Phases 1–3 are independent of each other and of 4–6; can be reordered.)
(Captive portal — OUT OF SCOPE — consumes Phase 4/5/6 outputs.)
```

## Mock bucket inventory (target state)

| Bucket            | New? | Writes from        | Reads from              |
|-------------------|------|--------------------|-------------------------|
| `usr1` (users)    | enrich | Admin (invite/edit) | Admin + auth/me         |
| `org1` (orgs)     | exists | Admin              | Admin                   |
| `grp1` (groups)   | exists | Admin              | Admin                   |
| `loc1` (sites)    | new  | Admin              | Admin                   |
| `dev1` (devices)  | new  | Admin (adopt)      | Admin                   |
| `plan1` (plans)   | new  | Admin              | Admin + Portal (public) |
| `pay1` (payment methods) | new | Admin       | Admin + Portal (enabled)|
| `ord1` (orders)   | new  | Portal             | Admin (reporting)       |

---

## PHASE 0 — Backend-driven identity + RBAC core

**Goal:** Logging in with role-specific credentials returns a real
`/auth/me/` profile from Mockoon, and the UI gates on the derived role.

### Task 0.1 — Point the app at the mock stack (dev)
- Add `EXPO_PUBLIC_API_URL=http://<host>:4011/api/v1` to `.env` (document
  `10.0.2.2` for Android emulator, LAN IP for physical device).
- **AC:** `console`-logged base URL resolves to the mock in dev; a manual
  `curl` of `/auth/me/` shape matches `src/types/api.ts User`.
- **Verify:** RTK Query `getMe` returns Alice over HTTP (temporary log).

### Task 0.2 — Mockoon: 4 role accounts + credential-keyed auth
- Enrich `usr1` with 4 seeded users (Super Admin, Delegate, Admin, Viewer),
  each with the correct boolean combo + `email`/`username`.
- `POST users/token/`: Handlebars conditional on posted `username`/`email`
  → embed that user's id/role in the returned JWT (still no real signing).
- `GET auth/me/`: return the profile matching the bearer token's subject
  (read claim or map token→user), not a fixed superuser.
- **AC:** `curl` token for each of the 4 usernames returns distinct JWTs;
  `auth/me/` with each token returns the matching role's booleans.
- **Verify:** 4 `curl` round-trips documented in the task.
- `docker compose restart` in `openwisp-mockoon/`.

### Task 0.3 — App: real login + bootstrap via network
- `mockAuth.mockLogin` → POST credentials to `users/token/`, store returned
  token; drop hardcoded `MOCK_USER` return.
- `useAuth.login`/`bootstrap` → call `/auth/me/` (via existing `authApi`)
  in dev too; remove the `MOCK_USER` injection branch.
- Keep `MOCK_AUTH_ENABLED` only to skip real Keycloak OAuth, not to bypass
  the network.
- **AC:** Logging in as each of the 4 accounts puts the correct user in
  Redux (`state.auth.user`); restart re-hydrates via `/auth/me/`.
- **Verify:** Manual login as Viewer and as Super Admin; inspect Redux.

### Task 0.4 — RBAC core primitives
- `deriveRole(user): Role` + `can(role, action): boolean` in
  `src/features/auth/rbac.ts`.
- `useRole()` / `useCan()` hooks; `<RoleGate allow={...}>` component.
- **AC:** Unit test table for `deriveRole` (4 inputs → 4 roles) and `can`
  (key actions per role) passes.
- **Verify:** `npm test` (or jest) green for `rbac.test.ts`.

### Task 0.5 — Apply gating to nav + screens
- Filter `mobileNavConfig` / `DrawerContent` by role; hide admin-only
  routes from Viewer.
- Wrap write actions (create/edit/delete buttons) in `<RoleGate>`.
- **AC:** Viewer sees read-only screens, no create/edit/delete affordances;
  Admin sees them; Super Admin/Delegate see role management too.
- **Verify:** Manual pass logging in as each role.

### Task 0.6 — Tenant-scoping foundation (multi-tenancy)
- **Type:** change `User.organization_users` to `OrganizationUser[]` with
  `{ organization, is_admin, is_owner }`.
- **Mock (`usr1`):** make each seeded user's `organization_users` a list, and
  spread the 4 accounts across **different** orgs — e.g. Super Admin =
  `is_superuser` (all tenants), an Admin belonging to only org A, another
  Admin/Viewer belonging to org B — so cross-tenant isolation is demonstrable.
  Seed ≥2 orgs in `org1`.
- **Auth helpers:** `memberOrgIds(user)` and `canAccessOrg(user, orgId)`
  (superuser ⇒ always true) in `src/features/auth/rbac.ts`.
- **Org selector:** filter `orgSelect` to the user's member orgs (superuser
  sees all); set a sensible default active org on login if none selected.
- **Scoping seam:** add a small helper that appends `?organization=<activeOrgId>`
  to scoped list queries and stamps `organization` on creates, used by all
  entity phases below.
- **AC:** Logging in as the org-A Admin shows only org A in the selector and
  cannot switch to org B; the Super Admin sees all orgs. `canAccessOrg`
  blocks deep-linking to an asset outside the active org.
- **Verify:** Login as org-A Admin and as Super Admin; confirm selector
  contents differ. Unit test `canAccessOrg` / `memberOrgIds` (superuser,
  member, non-member cases).

> **CHECKPOINT 0** — Stop. Demo all 4 logins + role gating + **tenant
> isolation** (org-A admin cannot see org B) before proceeding.

---

## PHASE 1 — Users · Invite · Assign roles

**Goal:** Admin can list users, invite by email+role (pending state),
the invitee can accept via a public link, and roles are editable.

> **Tenant scope:** all user operations are scoped to the **active org**. An
> Admin lists/invites/edits users *within their tenants*, not globally;
> invites add the user to the active org's `organization_users`. Superuser
> sees users across all orgs. Every AC below is satisfied within the active
> org and isolation from other orgs is verified.

### Task 1.1 — Mockoon: user status + role fields
- Add `status` (`active` | `pending`) and an invite `token` field to `usr1`
  seed; ensure CRUD already supports POST/PATCH (it does).
- **AC:** `curl` create a pending user; `curl` list shows it.

### Task 1.2 — Users list (wired)
- Build `users/index.tsx` from `usr1` via a new `usersApi` (list/detail).
- Show role badge (derived) + status.
- **AC:** List renders seeded + newly created users; pull-to-refresh works.

### Task 1.3 — Invite user flow
- Invite form (email + role picker) → POST `usr1` with `status:"pending"`,
  generated invite `token`. Appears as "Pending Invitation" with **Resend**.
- Role picker maps display role → boolean combo before POST.
- **AC:** Inviting creates a pending user visible in the list; gated to
  Admin+.
- **Verify:** Invite as Admin; confirm Viewer cannot see the invite button.

### Task 1.4 — Accept-invite public route
- Public route `(public)/invite/accept?token=...` simulating the invitee:
  any valid token → set password form → PATCH user to `status:"active"`.
- **AC:** Opening the accept route with a pending user's token flips it to
  active; user can then log in.
- **Verify:** End-to-end: invite → accept → login as the new user.

### Task 1.5 — Edit role on user detail
- User detail screen with role dropdown (Super Admin/Delegate only).
- **AC:** Changing role PATCHes the boolean combo; re-login reflects new
  permissions.

> **CHECKPOINT 1** — Demo invite → accept → login → role change.

---

## PHASE 2 — Sites (controller/location)

**Goal:** Sites modeled as OpenWISP `controller/location`, full CRUD,
**scoped to the active tenant**.

### Task 2.1 — Mockoon: `loc1` bucket + CRUD + paginated envelope
- Seed sites with an `organization` field, spread across ≥2 orgs (so scoping
  is testable). CRUD route + paginated GET wrapper that supports
  `?organization=` filtering. Match OpenWISP `controller/location` shape.
- **AC:** `curl ...?organization=<A>` returns only org-A sites; list/create/
  delete persist across requests (until restart).

### Task 2.2 — Sites screen wired
- Replace `geographic-info/locations.tsx` stub with list from `loc1` via
  new `sitesApi`, **filtered by active org**; create stamps active org;
  create/edit/delete gated to Admin+.
- **AC:** Switching active org changes the visible sites; creating a site
  stamps the active org; Viewer read-only; org-A admin never sees org-B sites.

> **CHECKPOINT 2** — Demo site CRUD + gating.

---

## PHASE 3 — Devices + adoption workflow

**Goal:** Devices carry adoption status; admin adopts PENDING → MANAGED,
**scoped to the active tenant**.

### Task 3.1 — Mockoon: `dev1` bucket with status
- Seed devices with `status` (`pending` | `managed`), an `organization` field,
  and a site reference; CRUD + paginated with `?organization=` filtering.
  Match OpenWISP `controller/device` shape.
- **AC:** `curl ...?organization=<A>` returns only org-A devices; PATCH status
  persists.

### Task 3.2 — Devices screen + adopt action
- Wire `devices/index.tsx` to `dev1` via `devicesApi`, **filtered by active
  org**; show status; **Adopt** action PATCHes `pending`→`managed` (gated
  Admin+).
- **AC:** Adopting a pending device flips it to managed; Viewer sees status
  but no Adopt button; org-A admin never sees org-B devices.

> **CHECKPOINT 3** — Demo adoption flow + gating.

---

## PHASE 4 — Plans (FPU/PPU) admin configuration

**Goal:** Admin configures FPU and PPU plans; data is the source the portal
will later consume.

### Task 4.1 — Mockoon: `plan1` bucket + CRUD + public view
- Seed FPU and PPU plans (name, family `FPU|PPU`, duration, speed cap,
  device limit, price, `is_active`, **`organization`**), spread across ≥2
  orgs. CRUD + admin paginated GET with `?organization=` filtering.
- Add a **public GET** (`plans/public` or rule on no-auth) returning only
  `is_active` plans with admin fields stripped — for the future portal.
  Public view filters by org too (the portal will pass the site's org).
- **AC:** Admin GET `...?organization=<A>` shows only org-A plans; public GET
  shows only active, filtered.

### Task 4.2 — Rework `subscriptions/plans.tsx` into admin config
- Replace the hardcoded tier/duration picker with a list of plans from
  `plan1` via `plansApi`, **filtered by active org**; create stamps active
  org; create/edit/activate-deactivate FPU & PPU plans.
- **AC:** Created plan persists, stamped with active org; switching org
  changes visible plans; Viewer read-only.
- **Note:** These are custom routes (OpenWISP has no native FPU/PPU model) —
  flagged as not 1:1 with a future real backend.

> **CHECKPOINT 4** — Demo plan config (both families) + public-view filter.

---

## PHASE 5 — Payment methods admin configuration

**Goal:** Admin enables/configures payment providers; only enabled ones are
exposed (for the future portal). Reconcile with existing local slice.

### Task 5.1 — Mockoon: `pay1` bucket
- Seed providers (MTN MoMo, Orange Money, Card) with `enabled` + config
  fields + **`organization`** (each tenant configures its own providers),
  across ≥2 orgs. CRUD + admin GET (`?organization=` filter) + public GET
  (enabled only, by org).
- **AC:** Toggling `enabled` persists; admin GET is org-scoped; public GET
  lists only enabled for that org.

### Task 5.2 — Admin payment-methods screen
- New admin screen to enable/disable + configure providers via `paymentsApi`,
  **filtered by active org**; changes stamp the active org.
- Reconcile: the existing `paymentMethods` Redux slice models a *user's saved
  instruments* — keep it for the settings screen, but the **admin provider
  config** is the new backend-backed concept. Document the distinction.
- **AC:** Enabling a provider here changes the public GET output.

> **CHECKPOINT 5** — Demo provider enable/disable + public filtering.

---

## PHASE 6 — Orders + Payments (reporting, read-only)

**Goal:** Admin reporting views over orders/payments the portal will write.

### Task 6.1 — Mockoon: `ord1` bucket (+ payments view)
- Seed a few orders/payments referencing plans + providers, each with an
  `organization` field, across ≥2 orgs. CRUD with `?organization=` filtering.
  Read-mostly for admin; the portal will POST here later.
- **AC:** `curl ...?organization=<A>` returns only org-A orders.

### Task 6.2 — Orders + Payments screens wired
- Wire `subscriptions/orders.tsx` and `subscriptions/payments.tsx` to `ord1`,
  **filtered by active org**.
- **AC:** Lists render seeded data scoped to active org; read-only for all
  admin roles.

> **CHECKPOINT 6** — Final demo: full admin plane end-to-end. Hand off to
> captive-portal effort (consumes Phase 4/5/6 public endpoints).

---

## Cross-cutting (every task)

- **Tenant scoping:** every entity list query filters by the active org and
  every create stamps it (`?organization=<activeOrgId>` — the swappable seam).
  Superuser bypasses scoping. Established in Task 0.6, applied in every entity
  phase.
- **i18n:** add EN + FR strings as each screen is built (infra exists). No
  final translation pass.
- **Icons:** use `AppIcon` only.
- **Verification:** each task lists a concrete check; a task is done only when
  its AC is demonstrated (curl output and/or a manual login pass).
- **Commits:** one focused commit per task; branch off `main`.

## Resolved decisions (confirmed)

1. **Testing target: physical device — Redmi 8A on the same WiFi.**
   `EXPO_PUBLIC_API_URL=http://192.168.1.114:4011/api/v1` (host LAN IP on
   `wlp4s0`). Mockoon is published on `0.0.0.0:4011`, so reachable on LAN —
   confirm the host firewall allows inbound 4011 from the LAN during 0.1.
   Note: this is a new **Expo** var (`EXPO_PUBLIC_*`); the existing `.env`
   `NEXT_PUBLIC_*` entries belong to the Next.js web app and are untouched.
2. **`auth/me/` resolves the user by decoding the JWT subject** (`sub` claim).
   `users/token/` embeds the matched user's id as `sub`; `auth/me/` reads the
   bearer token's `sub` and returns that user from `usr1`. More realistic and
   swappable.
</content>
