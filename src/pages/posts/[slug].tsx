import React from 'react';
import { client } from 'api/client';
import { getPost } from 'api/queries';

const Post = ({ post }) => (
  <div>
    <h1>{post.title}</h1>
    <p>{post.body}</p>
  </div>
);

export const getStaticProps = async ({ params }) => {
  console.debug('Fetching static props');
  const post = await getPost(params.slug);
  return { props: { post: post?.data?.blogPostCollection?.items?.[0] } };
};

interface PostEntry {
  title: string;
  slug?: string;
}
export const getStaticPaths = async () => {
  const allEntries = await client.getEntries<PostEntry>();
  const posts = allEntries.items ?? [];
  const paths = posts.map((post) => `/posts/${post.fields.slug}`);
  return { paths, fallback: false };
};

export default Post;
