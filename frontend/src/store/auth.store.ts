import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'OWNER' | 'CASHIER' | 'WAITER' | 'KITCHEN';

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
  tenantId: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  tenantSlug: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  setTenantSlug: (slug: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tenantSlug: null,
      setAuth: (user, token) => set({ user, token }),
      setTenantSlug: (slug) => set({ tenantSlug: slug }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'pos-auth' },
  ),
);
