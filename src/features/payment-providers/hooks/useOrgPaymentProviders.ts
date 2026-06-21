import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../auth/slice/authSlice';
import { selectActiveOrganizationId } from '../../organizations/slice/organizationSlice';
import { useGetPaymentProvidersQuery } from '../api/paymentProvidersApi';
import type { PaymentProvider } from '../../../types/api';

/** Payment providers scoped to the active org. Superusers see all. */
export function useOrgPaymentProviders() {
  const me = useAppSelector(selectUser);
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const query = useGetPaymentProvidersQuery({ organization: activeOrgId });

  const providers = useMemo<PaymentProvider[]>(() => {
    const all = query.data?.results ?? [];
    if (me?.is_superuser) return all;
    if (!activeOrgId) return [];
    return all.filter((p) => p.organization === activeOrgId);
  }, [query.data, me, activeOrgId]);

  return { ...query, providers, activeOrgId };
}
