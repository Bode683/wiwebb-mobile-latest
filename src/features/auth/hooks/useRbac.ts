import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../slice/authSlice';
import {
  deriveRole,
  can as canFn,
  canAccessOrg as canAccessOrgFn,
  memberOrgIds as memberOrgIdsFn,
  type Action,
  type Role,
} from '../rbac';

/** Current user's derived role. */
export function useRole(): Role {
  const user = useAppSelector(selectUser);
  return useMemo(() => deriveRole(user), [user]);
}

/** Role-axis permission check, bound to the current user. */
export function useCan(action: Action): boolean {
  const user = useAppSelector(selectUser);
  return useMemo(() => canFn(user, action), [user, action]);
}

/** Tenant + role helpers bound to the current user. */
export function useRbac() {
  const user = useAppSelector(selectUser);
  return useMemo(
    () => ({
      role: deriveRole(user),
      can: (action: Action) => canFn(user, action),
      canAccessOrg: (orgId: string | null | undefined) =>
        canAccessOrgFn(user, orgId),
      memberOrgIds: memberOrgIdsFn(user),
      isSuperuser: !!user?.is_superuser,
    }),
    [user],
  );
}
