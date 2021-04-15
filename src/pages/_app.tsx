import 'styles/global.css';
import type { AppProps } from 'next/app';
import { Header } from 'components/Header/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
