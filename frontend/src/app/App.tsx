import '../lib/i18n'; // must be imported before anything that uses translations
import { Providers } from './providers';
import AppRouter from './router';

export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
