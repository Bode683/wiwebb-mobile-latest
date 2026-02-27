import type { User } from '../../../types/api';
import { setAccessToken, setRefreshToken, clearTokens } from './tokenStorage';

export const MOCK_AUTH_ENABLED = __DEV__;

export const MOCK_USER: User = {
  id: 'mock-user-001',
  username: 'devuser',
  first_name: 'Dev',
  last_name: 'User',
  email: 'dev@mock.local',
  bio: '',
  url: '',
  company: 'wiweeb',
  location: '',
  phone_number: null,
  birth_date: null,
  notes: '',
  is_active: true,
  is_staff: false,
  is_superuser: false,
  last_login: null,
  date_joined: new Date().toISOString(),
  groups: [],
  user_permissions: [],
  organization_users: null,
};

function buildFakeJwt(): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(
    JSON.stringify({
      sub: MOCK_USER.id,
      email: MOCK_USER.email,
      name: `${MOCK_USER.first_name} ${MOCK_USER.last_name}`,
      preferred_username: MOCK_USER.username,
      realm_access: { roles: ['user'] },
      iat: now,
      exp: now + 86400,
    }),
  );
  return `${header}.${payload}.mock-signature`;
}

export async function mockLogin(
  _email: string,
  _password: string,
): Promise<User> {
  const token = buildFakeJwt();
  await setAccessToken(token);
  await setRefreshToken(`refresh-${token}`);
  return MOCK_USER;
}

export async function mockLogout(): Promise<void> {
  await clearTokens();
}
