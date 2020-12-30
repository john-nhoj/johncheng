import React from 'react';
import classNames from 'classnames';

type HeaderLinkProps = {
  label: string;
  link: string;
  className?: string;
};

export const HeaderLink = ({ label, link, className }: HeaderLinkProps) => (
  <a
    href={link}
    className={classNames(
      className,
      'flex',
      'items-center',
      'first:ml-0',
      'ml-8',
      'header-link'
    )}
  >
    {label}
  </a>
);
