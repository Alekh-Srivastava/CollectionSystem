import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import LoadingState from '../components/LoadingState';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar />
      {isLoading ? <LoadingState /> : <Component {...pageProps} />}
      <Toaster position="top-right" />
    </div>
  );
}

export default MyApp;