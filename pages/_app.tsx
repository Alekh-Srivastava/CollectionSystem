import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="min-h-screen bg-lime-50">
        <Component {...pageProps} />
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default MyApp;