import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../auth/slice/authSlice';
import { selectActiveOrganizationId } from '../../organizations/slice/organizationSlice';
import { useGetOrdersQuery } from '../api/ordersApi';
import type { Order } from '../../../types/api';

/** Orders scoped to the active org. Superusers see all. */
export function useOrgOrders() {
  const me = useAppSelector(selectUser);
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const query = useGetOrdersQuery({ organization: activeOrgId });

  const orders = useMemo<Order[]>(() => {
    const all = query.data?.results ?? [];
    if (me?.is_superuser) return all;
    if (!activeOrgId) return [];
    return all.filter((o) => o.organization === activeOrgId);
  }, [query.data, me, activeOrgId]);

  return { ...query, orders, activeOrgId };
}
