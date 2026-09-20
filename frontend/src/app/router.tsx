import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import SetupPage from '../features/auth/SetupPage';
import LoginPage from '../features/auth/LoginPage';
import RequireAuth from '../features/auth/RequireAuth';
import PosPage from '../features/pos/PosPage';
import KitchenPage from '../features/kitchen/KitchenPage';
import AdminPage from '../features/menu-admin/AdminPage';

export default function AppRouter() {
  const tenantSlug = useAuthStore((s) => s.tenantSlug);

  // First-run: no slug configured yet
  if (!tenantSlug) return <SetupPage />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pos" element={<RequireAuth roles={['CASHIER', 'WAITER', 'OWNER']}><PosPage /></RequireAuth>} />
        <Route path="/kitchen" element={<RequireAuth roles={['KITCHEN', 'OWNER']}><KitchenPage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth roles={['OWNER']}><AdminPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
