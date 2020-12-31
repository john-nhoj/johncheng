import 'styles/global.css';
import 'styles/typography.css';
import type { AppProps } from 'next/app';
import { Header } from 'components/Header/Header';
import classNames from 'classnames';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <main className={classNames('sm:px-20', 'md:px-40', 'xl:px-gutter')}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
