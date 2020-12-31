import React from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { Link, LinkProps } from 'components/Link/Link';

// Next.js Link automatically propagates the href to <a>,
// so it is actually interactive, responds to key events and these errors are false positives
/* eslint-disable jsx-a11y/anchor-is-valid */
export const LogoLink = (props: LinkProps) => (
  <Link className={classNames('py-2', 'md:py-4')} {...props}>
    <Image src="/logo.svg" alt="Website logo" width={200} height={28} />
  </Link>
);
