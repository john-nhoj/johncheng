import 'styles/global.css';
import 'styles/typography.css';
import 'styles/layout.css';
import type { AppProps } from 'next/app';
import { Header } from 'components/Header/Header';
import classNames from 'classnames';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main className={classNames('flex', 'flex-grow', 'flex-col')}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
