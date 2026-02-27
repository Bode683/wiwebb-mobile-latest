# API Reference

This document describes how the frontend makes requests to the OpenWISP backend API.
It covers the mock server setup used during development and the real API surface.

---

## Base URLs

| Environment | URL | Served by |
|---|---|---|
| Development (mock) | `http://localhost:4011` | Mockoon — single entry point for all routes |
| Production | `http://api.theddt.local/api/v1` | Real backend |

Set via `NEXT_PUBLIC_API_URL` in `.env.local`.

> **Mock server routing:** Mockoon is the single entry point for all API calls during
> development. It handles `/api/v1/users/*` and `/api/v1/auth/me/` directly with full
> CRUD persistence. All other routes (controller, monitoring, firmware-upgrader, etc.)
> are transparently proxied from Mockoon to Prism — no separate port or config needed.

---

## Authentication

### Obtain a Token

```
POST /api/v1/users/token/
```

No `Authorization` header required. Send credentials in the request body.

**Request body:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Store this token and attach it to all subsequent requests.

### Authenticated Requests

All endpoints (except `POST /users/token/`) require:

```
Authorization: Bearer <token>
```

In RTK Query this is handled globally in `baseApi.ts` via `prepareHeaders`. During
development with `NEXT_PUBLIC_MOCK_AUTH=true`, a fake JWT is injected automatically —
no login step is needed.

---

## Current User

### Get Session User

```
GET /api/v1/auth/me/
```

Returns the profile of the currently authenticated user.

**Response `200 OK`:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "admin",
  "first_name": "Alice",
  "last_name": "Nakamura",
  "email": "alice.nakamura@acmenetwork.example",
  "bio": "Platform administrator for OpenWISP.",
  "url": "",
  "company": "Acme Network Solutions",
  "location": "San Francisco, CA",
  "phone_number": null,
  "birth_date": null,
  "notes": "",
  "is_active": true,
  "is_staff": true,
  "is_superuser": true,
  "last_login": "2025-01-15T09:22:00.000Z",
  "date_joined": "2023-07-22T10:00:00.000Z",
  "groups": [],
  "user_permissions": [],
  "organization_users": {
    "is_admin": true,
    "organization": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
}
```

> This endpoint is custom to this application — it is not part of the OpenWISP spec.
> It is defined in Mockoon as a static route and in production will be served by the
> real backend.

---

## Users

Base path: `/api/v1/users/user/`
Served by: **Mockoon** (CRUD persistent)

### List Users

```
GET /api/v1/users/user/
```

**Response `200 OK`:**
```json
{
  "results": [
    {
      "id": "4a9c984f-b01d-499f-a02c-77a3c950c0ad",
      "username": "Katelin45",
      "email": "Braxton_Bartell99@gmail.com",
      "email_verified": false,
      "password": "pbkdf2_sha256$260000$mock$hashedpassword",
      "first_name": "Clark",
      "last_name": "Streich",
      "bio": "",
      "url": "",
      "company": "Brekke, Moen and Prosacco",
      "location": "South Valley",
      "phone_number": "1-555-414-8341 x5063",
      "birth_date": null,
      "notes": "",
      "is_active": true,
      "is_staff": true,
      "is_superuser": true,
      "last_login": "2025-01-15T09:22:00.000Z",
      "date_joined": "2023-07-22T10:00:00.000Z",
      "groups": [],
      "user_permissions": [],
      "organization_users": {
        "is_admin": true,
        "organization": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    }
  ],
  "count": 10,
  "next": null,
  "previous": null
}
```

### Get User

```
GET /api/v1/users/user/{id}/
```

### Create User

```
POST /api/v1/users/user/
```

**Request body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword",
  "is_active": true
}
```

**Response `201 Created`:** Returns the created user object.

### Update User

```
PUT    /api/v1/users/user/{id}/
PATCH  /api/v1/users/user/{id}/
```

### Delete User

```
DELETE /api/v1/users/user/{id}/
```

**Response `204 No Content`**

### Change Password

```
PUT /api/v1/users/user/{id}/password/
```

**Request body:**
```json
{
  "current_password": "old",
  "new_password": "new",
  "confirm_password": "new"
}
```

### User Email Addresses

```
GET    /api/v1/users/user/{id}/email/
POST   /api/v1/users/user/{id}/email/
GET    /api/v1/users/user/{id}/email/{email_id}/
PATCH  /api/v1/users/user/{id}/email/{email_id}/
DELETE /api/v1/users/user/{id}/email/{email_id}/
```

---

## Organizations

Base path: `/api/v1/users/organization/`
Served by: **Mockoon** (CRUD persistent)

### List Organizations

```
GET /api/v1/users/organization/
```

**Response `200 OK`:**
```json
{
  "results": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Acme Network Solutions",
      "is_active": true,
      "slug": "acme-network-solutions",
      "description": "Primary organization.",
      "email": "contact@acmenetwork.example",
      "url": "https://acmenetwork.example",
      "owner": {
        "organization_user": null
      },
      "created": "2023-06-15T08:30:00.000Z",
      "modified": "2024-01-10T11:20:00.000Z"
    }
  ],
  "count": 10,
  "next": null,
  "previous": null
}
```

### Get Organization

```
GET /api/v1/users/organization/{id}/
```

### Create Organization

```
POST /api/v1/users/organization/
```

**Request body:**
```json
{
  "name": "New Org",
  "slug": "new-org",
  "is_active": true,
  "email": "admin@neworg.example"
}
```

### Update / Delete Organization

```
PUT    /api/v1/users/organization/{id}/
PATCH  /api/v1/users/organization/{id}/
DELETE /api/v1/users/organization/{id}/
```

---

## Groups

Base path: `/api/v1/users/group/`
Served by: **Mockoon** (CRUD persistent)

### List Groups

```
GET /api/v1/users/group/
```

**Response `200 OK`:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Network Administrators",
      "permissions": []
    }
  ],
  "count": 10,
  "next": null,
  "previous": null
}
```

### Get / Create / Update / Delete Group

```
GET    /api/v1/users/group/{id}/
POST   /api/v1/users/group/
PUT    /api/v1/users/group/{id}/
PATCH  /api/v1/users/group/{id}/
DELETE /api/v1/users/group/{id}/
```

---

## Controller (Devices & Configuration)

Base path: `/controller/`
Served by: **Prism** (via Mockoon proxy — use `http://localhost:4011`)

### Devices

```
GET    /controller/device/
POST   /controller/device/
GET    /controller/device/{id}/
PUT    /controller/device/{id}/
PATCH  /controller/device/{id}/
DELETE /controller/device/{id}/
```

**Device list item shape:**
```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "name": "string",
  "organization": "452c1a86-a0af-475b-b03f-724878b0f387",
  "group": "fbd899a6-8a66-4f51-a95d-68668de198ae",
  "mac_address": "string",
  "key": "string",
  "last_ip": "string",
  "management_ip": "string",
  "model": "string",
  "os": "string",
  "system": "string",
  "notes": "string",
  "config": {
    "status": "modified",
    "error_reason": "string",
    "backend": "netjsonconfig.OpenWrt",
    "templates": ["497f6eca-6276-4993-bfeb-53cbbbba6f08"],
    "context": {},
    "config": {}
  },
  "created": "2019-08-24T14:15:22Z",
  "modified": "2019-08-24T14:15:22Z"
}
```

### Device Actions

```
POST /controller/device/{id}/activate/
POST /controller/device/{id}/deactivate/
GET  /controller/device/{id}/configuration/
GET  /controller/device/{id}/coordinates/
PUT  /controller/device/{id}/coordinates/
GET  /controller/device/{id}/location/
PUT  /controller/device/{id}/location/
```

### Device Commands

```
GET  /controller/device/{device_id}/command/
POST /controller/device/{device_id}/command/
GET  /controller/device/{device_id}/command/{id}/
```

### Device Connections

```
GET    /controller/device/{device_id}/connection/
POST   /controller/device/{device_id}/connection/
GET    /controller/device/{device_id}/connection/{id}/
PUT    /controller/device/{device_id}/connection/{id}/
PATCH  /controller/device/{device_id}/connection/{id}/
DELETE /controller/device/{device_id}/connection/{id}/
```

### Templates

```
GET    /controller/template/
POST   /controller/template/
GET    /controller/template/{id}/
PUT    /controller/template/{id}/
PATCH  /controller/template/{id}/
DELETE /controller/template/{id}/
GET    /controller/template/{id}/configuration/
```

### VPNs

```
GET    /controller/vpn/
POST   /controller/vpn/
GET    /controller/vpn/{id}/
PUT    /controller/vpn/{id}/
PATCH  /controller/vpn/{id}/
DELETE /controller/vpn/{id}/
GET    /controller/vpn/{id}/configuration/
```

### Certificate Authorities

```
GET    /controller/ca/
POST   /controller/ca/
GET    /controller/ca/{id}/
PUT    /controller/ca/{id}/
DELETE /controller/ca/{id}/
GET    /controller/ca/{id}/crl
POST   /controller/ca/{id}/renew/
```

### Certificates

```
GET    /controller/cert/
POST   /controller/cert/
GET    /controller/cert/{id}/
PUT    /controller/cert/{id}/
DELETE /controller/cert/{id}/
POST   /controller/cert/{id}/renew/
POST   /controller/cert/{id}/revoke/
GET    /controller/cert/{common_name}/group/
```

### Device Groups

```
GET    /controller/group/
POST   /controller/group/
GET    /controller/group/{id}/
PUT    /controller/group/{id}/
PATCH  /controller/group/{id}/
DELETE /controller/group/{id}/
```

### Credentials

```
GET    /controller/credential/
POST   /controller/credential/
GET    /controller/credential/{id}/
PUT    /controller/credential/{id}/
PATCH  /controller/credential/{id}/
DELETE /controller/credential/{id}/
```

### Locations & Floor Plans

```
GET    /controller/location/
POST   /controller/location/
GET    /controller/location/geojson/
GET    /controller/location/{id}/
PUT    /controller/location/{id}/
PATCH  /controller/location/{id}/
DELETE /controller/location/{id}/
GET    /controller/location/{id}/device/
GET    /controller/floorplan/
POST   /controller/floorplan/
GET    /controller/floorplan/{id}/
PUT    /controller/floorplan/{id}/
PATCH  /controller/floorplan/{id}/
DELETE /controller/floorplan/{id}/
```

---

## Monitoring

Base path: `/monitoring/`
Served by: **Prism** (via Mockoon proxy — use `http://localhost:4011`)

```
GET  /monitoring/dashboard/
GET  /monitoring/device/
GET  /monitoring/device/{id}/
POST /monitoring/device/{id}/
GET  /monitoring/device/{id}/nearby-devices/
GET  /monitoring/geojson/
GET  /monitoring/location/{id}/device/
GET  /monitoring/wifi-session/
GET  /monitoring/wifi-session/{id}/
```

**Monitoring device item shape:**
```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "name": "string",
  "organization": "452c1a86-a0af-475b-b03f-724878b0f387",
  "mac_address": "string",
  "management_ip": "string",
  "model": "string",
  "os": "string",
  "config": { "status": "modified" }
}
```

---

## Notifications

Base path: `/notifications/`
Served by: **Prism** (via Mockoon proxy — use `http://localhost:4011`)

```
GET    /notifications/notification/
GET    /notifications/notification/{id}/
PATCH  /notifications/notification/{id}/
DELETE /notifications/notification/{id}/
POST   /notifications/notification/read/
GET    /notifications/notification/ignore/
PUT    /notifications/notification/ignore/{app_label}/{model_name}/{object_id}/
DELETE /notifications/notification/ignore/{app_label}/{model_name}/{object_id}/
GET    /notifications/notification/{id}/redirect/
GET    /notifications/user/user-setting/
GET    /notifications/user/user-setting/{id}/
PATCH  /notifications/user/user-setting/{id}/
GET    /notifications/organization/{organization_id}/setting/
PATCH  /notifications/organization/{organization_id}/setting/
```

**Notification item shape:**
```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "level": "info",
  "unread": true,
  "message": "string",
  "description": "string",
  "target_url": "string",
  "email_subject": "string",
  "actor_content_type": 0,
  "target_content_type": 0
}
```

---

## IPAM (IP Address Management)

Base path: `/ipam/`
Served by: **Prism** (via Mockoon proxy — use `http://localhost:4011`)

```
GET    /ipam/subnet/
POST   /ipam/subnet/
GET    /ipam/subnet/{id}/
PUT    /ipam/subnet/{id}/
PATCH  /ipam/subnet/{id}/
DELETE /ipam/subnet/{id}/
POST   /ipam/import-subnet/
GET    /ipam/subnet/{subnet_id}/hosts/
GET    /ipam/subnet/{subnet_id}/ip-address/
POST   /ipam/subnet/{subnet_id}/ip-address/
POST   /ipam/subnet/{subnet_id}/request-ip/
GET    /ipam/subnet/{subnet_id}/get-next-available-ip/
POST   /ipam/subnet/{subnet_id}/export/
GET    /ipam/ip-address/{id}/
PUT    /ipam/ip-address/{id}/
PATCH  /ipam/ip-address/{id}/
DELETE /ipam/ip-address/{id}/
```

---

## Network Topology

Base path: `/network-topology/`
Served by: **Prism** (via Mockoon proxy — use `http://localhost:4011`)

```
GET    /network-topology/topology/
POST   /network-topology/topology/
GET    /network-topology/topology/{id}/
PUT    /network-topology/topology/{id}/
PATCH  /network-topology/topology/{id}/
DELETE /network-topology/topology/{id}/
GET    /network-topology/topology/{id}/history/
POST   /network-topology/topology/{id}/receive/
GET    /network-topology/node/
POST   /network-topology/node/
GET    /network-topology/node/{id}/
PUT    /network-topology/node/{id}/
PATCH  /network-topology/node/{id}/
DELETE /network-topology/node/{id}/
GET    /network-topology/link/
POST   /network-topology/link/
GET    /network-topology/link/{id}/
PUT    /network-topology/link/{id}/
PATCH  /network-topology/link/{id}/
DELETE /network-topology/link/{id}/
```

---

## Firmware Upgrader

Base path: `/firmware-upgrader/`
Served by: **Prism** (via Mockoon proxy — use `http://localhost:4011`)

```
GET  /firmware-upgrader/build/
POST /firmware-upgrader/build/
GET  /firmware-upgrader/build/{id}/
PUT  /firmware-upgrader/build/{id}/
PATCH /firmware-upgrader/build/{id}/
DELETE /firmware-upgrader/build/{id}/
GET  /firmware-upgrader/build/{id}/upgrade/
POST /firmware-upgrader/build/{id}/upgrade/
GET  /firmware-upgrader/build/{build_pk}/image/
POST /firmware-upgrader/build/{build_pk}/image/
GET  /firmware-upgrader/build/{build_pk}/image/{id}/
DELETE /firmware-upgrader/build/{build_pk}/image/{id}/
GET  /firmware-upgrader/build/{build_pk}/image/{id}/download/
GET  /firmware-upgrader/category/
POST /firmware-upgrader/category/
GET  /firmware-upgrader/category/{id}/
PUT  /firmware-upgrader/category/{id}/
PATCH /firmware-upgrader/category/{id}/
DELETE /firmware-upgrader/category/{id}/
GET  /firmware-upgrader/device/{id}/firmware/
PUT  /firmware-upgrader/device/{id}/firmware/
PATCH /firmware-upgrader/device/{id}/firmware/
DELETE /firmware-upgrader/device/{id}/firmware/
GET  /firmware-upgrader/device/{id}/upgrade-operation/
GET  /firmware-upgrader/upgrade-operation/
GET  /firmware-upgrader/upgrade-operation/{id}/
GET  /firmware-upgrader/batch-upgrade-operation/
GET  /firmware-upgrader/batch-upgrade-operation/{id}/
```

---

## RADIUS

Base path: `/radius/`
Served by: **Prism** (via Mockoon proxy — use `http://localhost:4011`)

```
POST /radius/batch/
GET  /radius/sessions/
POST /radius/organization/{slug}/account/
POST /radius/organization/{slug}/account/password/change/
POST /radius/organization/{slug}/account/password/reset/
POST /radius/organization/{slug}/account/password/reset/confirm/
POST /radius/organization/{slug}/account/phone/change/
POST /radius/organization/{slug}/account/phone/token/
GET  /radius/organization/{slug}/account/phone/token/active/
POST /radius/organization/{slug}/account/phone/verify/
GET  /radius/organization/{slug}/account/session/
POST /radius/organization/{slug}/account/token/
POST /radius/organization/{slug}/account/token/validate/
GET  /radius/organization/{slug}/account/usage/
GET  /radius/organization/{slug}/batch/{id}/pdf/
POST /freeradius/accounting/
POST /freeradius/authorize/
POST /freeradius/postauth/
```

---

## Common Patterns

### Pagination

All list endpoints return a paginated envelope:

```json
{
  "count": 100,
  "next": "http://localhost:4011/api/v1/users/user/?page=2",
  "previous": null,
  "results": [...]
}
```

When consuming in RTK Query, read from `.results`:

```ts
const users = data?.results ?? []
const total = data?.count ?? 0
```

### Filtering & Search

Append query params to list endpoints:

```
GET /api/v1/users/user/?is_active=true
GET /api/v1/users/user/?search=alice
GET /controller/device/?organization=<uuid>
```

### Error Responses

```json
{ "detail": "Not found." }                          // 404
{ "detail": "Authentication credentials not provided." }  // 401
{ "field_name": ["This field is required."] }        // 400 validation
```

---

## RTK Query Integration Notes

All API calls go through `baseApi` in `src/services/api/baseApi.ts`.

**Adding a new endpoint:**

```ts
// src/features/<feature>/api/<feature>Api.ts
import { baseApi } from '@/services/api/baseApi'

export const deviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDevices: builder.query<DeviceListResponse, void>({
      query: () => '/controller/device/',
      providesTags: ['Device'],
    }),
    getDevice: builder.query<Device, string>({
      query: (id) => `/controller/device/${id}/`,
      providesTags: (_result, _err, id) => [{ type: 'Device', id }],
    }),
    createDevice: builder.mutation<Device, Partial<Device>>({
      query: (body) => ({ url: '/controller/device/', method: 'POST', body }),
      invalidatesTags: ['Device'],
    }),
  }),
})

export const { useListDevicesQuery, useGetDeviceQuery, useCreateDeviceMutation } = deviceApi
```

**Tag types** are declared in `baseApi.ts`. Add new ones there as you build features:

```ts
tagTypes: ['User', 'Tenant', 'Project', 'Device', 'Template', 'Organization'],
```

**Base URL note:** All endpoints — including those proxied to Prism — are reachable
through `NEXT_PUBLIC_API_URL`. No separate base URL or second `createApi` instance
is needed. Point `NEXT_PUBLIC_API_URL` at `http://localhost:4011` in development and
`http://api.theddt.local/api/v1` in production.
