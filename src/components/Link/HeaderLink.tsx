import React from 'react';
import classNames from 'classnames';
import { Link, LinkProps } from 'components/Link/Link';

// Next.js Link automatically propagates the href to <a>,
// so it is actually interactive, responds to key events and these errors are false positives
/* eslint-disable jsx-a11y/anchor-is-valid */
export const HeaderLink = ({ label, ...rest }: LinkProps) => (
  <Link
    className={classNames(
      'first:ml-0',
      'ml-2',
      'p-2',
      'md:p-4',
      'md:text-lg',
      'lg:text-2xl'
    )}
    {...rest}
  >
    {label}
  </Link>
);
