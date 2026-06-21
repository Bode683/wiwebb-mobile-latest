import React, { ReactNode } from 'react';
import { useCan } from '../hooks/useRbac';
import type { Action } from '../rbac';

interface RoleGateProps {
  /** Action the user must be permitted to perform to see `children`. */
  action: Action;
  children: ReactNode;
  /** Rendered when the user lacks permission (default: nothing). */
  fallback?: ReactNode;
}

/**
 * Renders `children` only if the current user can perform `action`.
 * Use to gate write affordances (create/edit/delete/adopt buttons).
 */
export function RoleGate({ action, children, fallback = null }: RoleGateProps) {
  const allowed = useCan(action);
  return <>{allowed ? children : fallback}</>;
}
