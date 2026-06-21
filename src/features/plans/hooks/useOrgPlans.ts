import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../auth/slice/authSlice';
import { selectActiveOrganizationId } from '../../organizations/slice/organizationSlice';
import { useGetPlansQuery } from '../api/plansApi';
import type { Plan } from '../../../types/api';

/** Plans scoped to the active org. Superusers see all. */
export function useOrgPlans() {
  const me = useAppSelector(selectUser);
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const query = useGetPlansQuery({ organization: activeOrgId });

  const plans = useMemo<Plan[]>(() => {
    const all = query.data?.results ?? [];
    if (me?.is_superuser) return all;
    if (!activeOrgId) return [];
    return all.filter((p) => p.organization === activeOrgId);
  }, [query.data, me, activeOrgId]);

  return { ...query, plans, activeOrgId };
}
