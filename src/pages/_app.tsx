import 'styles/global.css';
import 'styles/typography.css';
import 'styles/layout.css';
import type { AppProps } from 'next/app';
import { Header } from 'components/Header/Header';
import classNames from 'classnames';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <main className={classNames('layout__margin--horizontal')}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
