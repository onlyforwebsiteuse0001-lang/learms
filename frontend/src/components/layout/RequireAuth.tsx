import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '../../store/auth';

/**
 * Route guard. Preserves the attempted URL in `?next=` so an expired session returns the
 * student to where they were rather than dumping them on the dashboard.
 *
 * This is a UX guard only — it hides nothing. Every protected resource is enforced
 * server-side by Agent 1's `get_current_student` dependency.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}
