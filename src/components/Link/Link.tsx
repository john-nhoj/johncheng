import React from 'react';
import classNames from 'classnames';
import NextJsLink, { LinkProps as NextJsLinkProps } from 'next/link';

export interface LinkProps extends NextJsLinkProps {
  children?: React.ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
}

// Next.js Link automatically propagates the href to <a>,
// so it is actually interactive, responds to key events and these errors are false positives
/* eslint-disable jsx-a11y/anchor-is-valid */
export const Link = ({ href, children, className, ...rest }: LinkProps) => (
  <NextJsLink href={href}>
    <a className={classNames(className, 'flex', 'items-center')} {...rest}>
      {children}
    </a>
  </NextJsLink>
);
