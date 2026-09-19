import { useTranslation } from 'react-i18next';

export default function AdminPage() {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-amber-800">{t('nav.admin')}</h1>
      {/* Menu admin implemented in Step 2 */}
    </div>
  );
}
