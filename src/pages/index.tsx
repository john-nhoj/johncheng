import React from 'react';
import { Introduction } from 'components/Introduction/Introduction';
import Head from 'next/head';

const Home = () => (
  <div>
    <Head>
      <title>John Cheng – Personal website</title>
      <meta name="description" content="Welcome page" />
    </Head>
    <Introduction />
  </div>
);

export default Home;
