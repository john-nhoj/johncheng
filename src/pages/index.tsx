import React from 'react';
import Head from 'next/head';
import { Introduction } from 'components/Introduction/Introduction';
import { BlogPosts } from 'components/BlogPosts';
import { getBlogPostsList } from 'api/queries';
import { Post } from 'src/types/contentful';

interface Props {
  posts: Array<Post>;
}

const Home = ({ posts }: Props) => (
  <>
    <Head>
      <title>John Cheng – Personal website</title>
      <meta name="description" content="Welcome page" />
    </Head>
    <Introduction />
    <BlogPosts posts={posts} />
  </>
);

export const getStaticProps = async () => {
  console.debug('Fetching blogposts');
  const allEntries = await getBlogPostsList();
  const posts = allEntries?.data?.blogPostCollection?.items ?? [];
  return { props: { posts } };
};

export default Home;
