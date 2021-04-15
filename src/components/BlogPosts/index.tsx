// import { getBlogPostsList } from 'api/queries';
import classNames from 'classnames';
import React from 'react';
import { Post } from 'src/types/contentful';
import { BlogPostCard } from 'components/BlogPosts/BlogPostCard';

interface Props {
  posts: Array<Post>;
}

const BlogPosts = ({ posts }: Props) => {
  return (
    <section
      className={classNames(
        'mt-2',
        'mt-20',
        'px-2',
        'md:px-4',
        'lg:px-20',
        'xl:px-gutter',
        'flex',
        'flex-col',
        'items-center'
      )}
    >
      <h2>Recent posts</h2>
      <div className={classNames('flex', 'flex-wrap', 'justify-center')}>
        {posts.map((post) => (
          <BlogPostCard post={post} key={post.sys.id} />
        ))}
      </div>
    </section>
  );
};

export { BlogPosts };
