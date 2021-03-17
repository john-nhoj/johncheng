import React from 'react';
import { client } from 'api/client';
import { getAuthor, getPost } from 'api/queries';

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

interface PostEntry {
  title: string;
  slug?: string;
}
export const getStaticPaths = async () => {
  const allEntries = await client.getEntries<PostEntry>({
    content_type: 'blogPost',
  });
  const posts = allEntries.items ?? [];
  const paths = posts.map((post) => `/posts/${post.fields.slug}`);
  return { paths, fallback: false };
};

export default Post;
