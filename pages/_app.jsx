import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Component {...pageProps} />
      </div>
      <Analytics />
    </AuthProvider>
  );
}

export default MyApp;
