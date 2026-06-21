import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../auth/slice/authSlice';
import { selectActiveOrganizationId } from '../../organizations/slice/organizationSlice';
import { useGetDevicesQuery } from '../api/devicesApi';
import type { Device } from '../../../types/api';

/** Devices scoped to the active org. Superusers see all. */
export function useOrgDevices() {
  const me = useAppSelector(selectUser);
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const query = useGetDevicesQuery({ organization: activeOrgId });

  const devices = useMemo<Device[]>(() => {
    const all = query.data?.results ?? [];
    if (me?.is_superuser) return all;
    if (!activeOrgId) return [];
    return all.filter((d) => d.organization === activeOrgId);
  }, [query.data, me, activeOrgId]);

  return { ...query, devices, activeOrgId };
}
