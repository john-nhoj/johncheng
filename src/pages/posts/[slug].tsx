import React from 'react';
import { getAllBlogPostsSlugs, getAuthor, getPost } from 'api/queries';

const Post = ({ post, author }) => (
  <div>
    <h1>{post.title}</h1>
    <h2>{author.name}</h2>
    <p>{post.body}</p>
  </div>
);

export const getStaticProps = async ({ params }) => {
  console.debug('Fetching static props');
  const post = await getPost(params.slug);
  const author = await getAuthor(
    post?.data?.blogPostCollection?.items?.[0].author.sys.id
  );
  return {
    props: {
      post: post?.data?.blogPostCollection?.items?.[0],
      author: author?.data?.person,
    },
  };
};

export const getStaticPaths = async () => {
  console.debug('Fetching static paths');
  const allEntries = await getAllBlogPostsSlugs();
  const posts = allEntries?.data?.blogPostCollection?.items ?? [];
  const paths = posts.map((post) => `/posts/${post.slug}`);
  return { paths, fallback: false };
};

export default Post;
