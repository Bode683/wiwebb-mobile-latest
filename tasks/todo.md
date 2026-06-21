# Wiweeb RBAC + Admin — Task List

Legend: `[ ]` todo · `[~]` in progress · `[x]` done
Captive portal is OUT OF SCOPE here (next effort).

## Phase 0 — Backend-driven identity + RBAC core
- [x] 0.1 Point app at mock stack via `EXPO_PUBLIC_API_URL` (dev)
- [x] 0.2 Mockoon: 4 role accounts + credential-keyed token/auth.me (verified via curl)
- [x] 0.3 App: real login + bootstrap via `/auth/me/` (dropped hardcoded MOCK_USER)
- [x] 0.4 RBAC core: deriveRole / can / useRbac / RoleGate (+ tests, 19 assertions pass)
- [x] 0.5 Apply gating to nav (filterNavByPermission + role badge)
- [x] 0.6 Tenant-scoping foundation: org_users list, canAccessOrg, scoped org selector
- [x] 0.6a FIX AuthBootstrap: list-aware membership gate (replaces organization_users.is_admin)
- [x] 0.6b Default activeOrganizationId to first member org on login; filter DrawerContent + orgSelect to member orgs
- [ ] ✋ CHECKPOINT 0 — demo 4 logins + role gating + tenant isolation (ON DEVICE)

## Phase 1 — Users · Invite · Assign roles
- [x] 1.1 Mockoon: usr1 reseeded — org_users list + status + invite_token (apply_users_phase1.py; curl POST/PATCH verified)
- [x] 1.2 Users list wired (usersApi + useOrgUsers active-org scoping, role badge + status, pull-to-refresh)
- [x] 1.3 Invite user flow (pending) + role picker (orgRoleToBooleans, gated manage_users)
- [x] 1.4 Accept-invite public route ((public)/invite/accept?token= → set password → PATCH active)
- [x] 1.5 Edit role on user detail ([id].tsx, role dropdown gated manage_roles + resend for pending)
- [x] 1.6 Onboarding: createTenant POSTs org, addOrganizationMembership + setActiveOrganization on completion
- [ ] ✋ CHECKPOINT 1 — invite → accept → login → role change (ON DEVICE)

## Phase 2 — Sites (controller/location)
- [x] 2.1 Mockoon: loc1 bucket + GET list (paginated) + CRUD route (apply_sites_phase2.py; rootChildren fix documented in memory)
- [x] 2.2 Sites screen wired: locations.tsx list + site-form.tsx (create/edit) + [id].tsx detail; useOrgSites active-org scoping; create/edit/delete gated manage_sites
- [ ] ✋ CHECKPOINT 2 — site CRUD + gating (ON DEVICE)

## Phase 3 — Devices + adoption
- [x] 3.1 Mockoon: `dev1` bucket with status (apply_devices_phase3.py; curl list + PATCH verified)
- [x] 3.2 Devices screen + adopt action (PENDING→MANAGED): devicesApi + useOrgDevices + devices/index.tsx
- [ ] ✋ CHECKPOINT 3 — adoption + gating

## Phase 4 — Plans (FPU/PPU) admin config
- [x] 4.1 Mockoon: `plan1` bucket + CRUD + public view (apply_plans_phase4.py; list + PATCH verified)
- [x] 4.2 Re-scope plans.tsx: admin plan config (FPU & PPU list + toggle + delete + plan-form create/edit); checkout UI in git history for portal
- [ ] ✋ CHECKPOINT 4 — plan config + public-view filter

## Phase 5 — Payment methods admin config
- [x] 5.1 Mockoon: `pay1` bucket (apply_payment_providers_phase5.py; 6 entries, list + PATCH verified)
- [x] 5.2 NEW admin payment-providers screen (paymentProvidersApi + useOrgPaymentProviders + subscriptions/payment-providers.tsx; toggle enable/disable gated manage_payment_methods; separate from existing paymentMethods slice)
- [ ] ✋ CHECKPOINT 5 — provider enable/disable + filtering

## Phase 6 — Orders + Payments (reporting)
- [x] 6.1 Mockoon: `ord1` bucket (apply_orders_phase6.py; 7 orders across 2 orgs, list verified)
- [x] 6.2 Orders + Payments screens wired (read-only): ordersApi + useOrgOrders + orders.tsx list + order-detail.tsx + payments.tsx (payment rows extracted from orders)
- [ ] ✋ CHECKPOINT 6 — final admin-plane demo, hand off to portal

## Resolved decisions
- [x] Target: physical Redmi 8A → `EXPO_PUBLIC_API_URL=http://192.168.1.114:4011/api/v1`
- [x] auth/me resolves user by decoding JWT `sub` claim
- [x] Multi-tenant: role × tenant axes; org_users is a list; entities scoped to active org (Task 0.6 + per-phase ACs)
</content>
