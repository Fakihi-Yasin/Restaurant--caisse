import '../lib/i18n'; // must be imported before anything that uses translations
import { Providers } from './providers';
import AppRouter from './router';
import { useOnlineStatus } from '../lib/useOnlineStatus';

function OfflineBadge() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-lg">
      Hors ligne
    </div>
  );
}

export default function App() {
  return (
    <Providers>
      <AppRouter />
      <OfflineBadge />
    </Providers>
  );
}
