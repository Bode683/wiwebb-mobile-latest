import { setAccessToken, setRefreshToken, clearTokens } from './tokenStorage';

/**
 * Dev auth: still bypasses real Keycloak OAuth, but now goes over the network
 * to the Mockoon stack — `users/token/` returns a role-specific JWT and the
 * profile is fetched from `auth/me/`. No more hardcoded MOCK_USER.
 */
export const MOCK_AUTH_ENABLED = __DEV__;

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.wiweeb.com';

/**
 * POST credentials to the token endpoint and persist the returned token.
 * Any password is accepted by the mock; the username selects the role
 * account (superadmin / delegate / admin / viewer).
 */
export async function mockLogin(
  identifier: string,
  _password: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/users/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: identifier, password: _password }),
  });
  if (!res.ok) {
    throw new Error(`Login failed (${res.status})`);
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) {
    throw new Error('Login failed: no token in response');
  }
  await setAccessToken(data.token);
  await setRefreshToken(`refresh-${data.token}`);
}

export async function mockLogout(): Promise<void> {
  await clearTokens();
}
