import { useTranslation } from 'react-i18next';

export default function PosPage() {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-amber-800">{t('nav.pos')}</h1>
      {/* POS screen implemented in Step 3 */}
    </div>
  );
}
