import { Navigate } from 'react-router-dom';
import { useAuthStore, type Role } from '../../store/auth.store';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  roles?: Role[];
}

export default function RequireAuth({ children, roles }: Props) {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'KITCHEN') return <Navigate to="/kitchen" replace />;
    if (user.role === 'OWNER') return <Navigate to="/admin" replace />;
    return <Navigate to="/pos" replace />;
  }
  return <>{children}</>;
}
