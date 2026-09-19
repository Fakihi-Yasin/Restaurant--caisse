import { useTranslation } from 'react-i18next';

export default function KitchenPage() {
  const { t } = useTranslation();
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold">{t('kitchen.title')}</h1>
      {/* Kitchen screen implemented in Step 4 */}
    </div>
  );
}
