import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuthStore, type Role } from '../../store/auth.store';

type StaffMember = { id: string; name: string; role: Role };

function PinPad({ onPin }: { onPin: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  const digits = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  function press(d: string) {
    if (d === '⌫') { setPin((p) => p.slice(0, -1)); return; }
    if (d === '') return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) { onPin(next); setPin(''); }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2 mb-2">
        {[0,1,2,3].map((i) => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 ${i < pin.length ? 'bg-amber-700 border-amber-700' : 'border-gray-400'}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {digits.map((d, i) => (
          <button
            key={i}
            onClick={() => press(d)}
            className={`h-16 rounded-xl text-2xl font-semibold transition-colors ${d === '' ? 'invisible' : 'bg-gray-100 hover:bg-amber-100 active:bg-amber-200'}`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth, tenantSlug, setTenantSlug } = useAuthStore();
  const [mode, setMode] = useState<'staff' | 'owner'>('staff');
  const [selectedUser, setSelectedUser] = useState<StaffMember | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { data: staff = [] } = useQuery<StaffMember[]>({
    queryKey: ['staff', tenantSlug],
    queryFn: () => api.get(`/auth/staff/${tenantSlug}`).then((r) => r.data),
    enabled: !!tenantSlug && mode === 'staff',
  });

  const loginMutation = useMutation({
    mutationFn: (payload: unknown) =>
      mode === 'owner'
        ? api.post('/auth/login', payload).then((r) => r.data)
        : api.post('/auth/login-pin', payload).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      const role: Role = data.user.role;
      if (role === 'KITCHEN') navigate('/kitchen');
      else if (role === 'OWNER') navigate('/admin');
      else navigate('/pos');
    },
    onError: () => setError(t('login.error')),
  });

  function handleOwnerSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  }

  function handlePin(pin: string) {
    if (!selectedUser) return;
    setError('');
    loginMutation.mutate({ tenantSlug, userId: selectedUser.id, pin });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-amber-800 mb-1 text-center">{t('login.title')}</h1>
        <p className="text-center text-sm text-gray-400 mb-4">{tenantSlug}</p>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          {(['staff','owner'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setSelectedUser(null); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-amber-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {m === 'staff' ? t('login.staffTab') : t('login.ownerTab')}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        {mode === 'staff' && !selectedUser && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-3">{t('login.selectStaff')}</p>
            {staff.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedUser(s)}
                className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-colors"
              >
                <span className="font-medium">{s.name}</span>
                <span className="ml-2 text-xs text-gray-400 uppercase">{s.role}</span>
              </button>
            ))}
          </div>
        )}

        {mode === 'staff' && selectedUser && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-700">{selectedUser.name}</span>
              <button onClick={() => setSelectedUser(null)} className="text-sm text-amber-700 hover:underline">{t('login.back')}</button>
            </div>
            <PinPad onPin={handlePin} />
          </div>
        )}

        {mode === 'owner' && (
          <form onSubmit={handleOwnerSubmit} className="space-y-4">
            <input
              type="email"
              placeholder={t('login.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="password"
              placeholder={t('login.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loginMutation.isPending ? t('common.loading') : t('login.submit')}
            </button>
          </form>
        )}

        <button
          onClick={() => setTenantSlug(null as unknown as string)}
          className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600"
        >
          {t('setup.change')}
        </button>
      </div>
    </div>
  );
}
