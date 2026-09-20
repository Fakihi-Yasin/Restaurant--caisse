import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/auth.store';

export default function SetupPage() {
  const { t } = useTranslation();
  const setTenantSlug = useAuthStore((s) => s.setTenantSlug);
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = slug.trim().toLowerCase();
    if (!val) { setError('Requis'); return; }
    setTenantSlug(val);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-amber-800 mb-2 text-center">{t('setup.title')}</h1>
        <p className="text-sm text-gray-500 text-center mb-6">{t('setup.slugHelp')}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('setup.slugLabel')}</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder={t('setup.slugPlaceholder')}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-xl text-lg transition-colors"
          >
            {t('setup.confirm')}
          </button>
        </form>
      </div>
    </div>
  );
}
