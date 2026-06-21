import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../auth/slice/authSlice';
import { selectActiveOrganizationId } from '../../organizations/slice/organizationSlice';
import { useGetUsersQuery } from '../api/usersApi';
import type { User } from '../../../types/api';

/**
 * Users visible to the current admin, scoped to the active org.
 * Superusers see everyone; regular admins see only members of the active org.
 */
export function useOrgUsers() {
  const me = useAppSelector(selectUser);
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const query = useGetUsersQuery({ organization: activeOrgId });

  const users = useMemo<User[]>(() => {
    const all = query.data?.results ?? [];
    if (me?.is_superuser) return all;
    if (!activeOrgId) return [];
    return all.filter((u) =>
      (u.organization_users ?? []).some((o) => o.organization === activeOrgId),
    );
  }, [query.data, me, activeOrgId]);

  return { ...query, users, activeOrgId };
}
