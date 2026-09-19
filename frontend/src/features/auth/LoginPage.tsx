import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-amber-800 mb-6 text-center">
          {t('login.title')}
        </h1>
        {/* Full form implemented in Step 2 */}
        <p className="text-center text-gray-400 text-sm">{t('common.loading')}</p>
      </div>
    </div>
  );
}
