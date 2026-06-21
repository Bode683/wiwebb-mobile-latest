import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../auth/slice/authSlice';
import { memberOrgIds } from '../../auth/rbac';
import { useGetOrganizationsQuery } from '../api/organizationApi';
import type { Organization } from '../../../types/api';

/**
 * Organizations the current user may see/manage.
 * Multi-tenant: regular users see only their memberships; superusers see all.
 */
export function useVisibleOrganizations() {
  const user = useAppSelector(selectUser);
  const query = useGetOrganizationsQuery();

  const organizations = useMemo<Organization[]>(() => {
    const all = query.data?.results ?? [];
    if (user?.is_superuser) return all;
    const ids = new Set(memberOrgIds(user));
    return all.filter((o) => ids.has(o.id));
  }, [query.data, user]);

  return { ...query, organizations };
}
