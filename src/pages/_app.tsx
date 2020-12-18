import 'styles/global.css';
import type { AppProps } from 'next/app';
import { Header } from 'components/Header/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;