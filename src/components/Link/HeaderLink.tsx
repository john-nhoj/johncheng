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
      'ml-8',
      'layout__padding--full',
      'header-link'
    )}
    {...rest}
  >
    {label}
  </Link>
);
