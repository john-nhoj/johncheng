import React from 'react';
import Image from 'next/image';
import { Post } from 'types/contentful';
import classNames from 'classnames';
import { Link } from 'components/Link/Link';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => (
  <Link
    href={`/posts/${post.slug}`}
    className={classNames('w-80', 'm-4', 'rounded-lg', 'shadow-2xl')}
  >
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
        'rounded-t-none',
        'p-4'
      )}
    >
      <h3 className={classNames('underline', 'text-lg')}>{post.title}</h3>
      <p className={classNames('mt-4')}>{post.description}</p>
      <p className={classNames('italic', 'mt-4')}>{post.publishDate}</p>
    </div>
  </Link>
);

export { BlogPostCard };
