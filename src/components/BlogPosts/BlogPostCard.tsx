import React from 'react';
import Image from 'next/image';
import { Post } from 'types/contentful';
import classNames from 'classnames';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => (
  <section className={classNames('w-80', 'm-4', 'rounded-lg', 'shadow-2xl')}>
    <div className={classNames('relative', 'h-60')}>
      <Image
        src={post.heroImage.url}
        alt=""
        layout="fill"
        className={classNames('rounded-lg', 'rounded-b-none')}
      />
    </div>
    <div
      className={classNames(
        'border',
        'border-t-0',
        'rounded-lg',
        'rounded-t-none'
      )}
    >
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <p>{post.publishDate}</p>
    </div>
  </section>
);

export { BlogPostCard };
