import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../auth/slice/authSlice';
import { selectActiveOrganizationId } from '../../organizations/slice/organizationSlice';
import { useGetSitesQuery } from '../api/sitesApi';
import type { Site } from '../../../types/api';

/** Sites scoped to the active org. Superusers see all. */
export function useOrgSites() {
  const me = useAppSelector(selectUser);
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const query = useGetSitesQuery({ organization: activeOrgId });

  const sites = useMemo<Site[]>(() => {
    const all = query.data?.results ?? [];
    if (me?.is_superuser) return all;
    if (!activeOrgId) return [];
    return all.filter((s) => s.organization === activeOrgId);
  }, [query.data, me, activeOrgId]);

  return { ...query, sites, activeOrgId };
}
