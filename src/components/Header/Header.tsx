import React from 'react';
import classNames from 'classnames';
import { HeaderLink } from 'components/Link/HeaderLink';
import { LogoLink } from 'components/Link/LogoLink';

export const Header = () => {
  return (
    <header
      className={classNames(
        'border-solid',
        'border-b-2',
        'h-header',
        'flex',
        'bg-white',
        'border-border',
        'px-2',
        'md:px-4',
        'lg:px-20',
        'xl:px-gutter'
      )}
    >
      <LogoLink href="/" />
      <nav
        className={classNames(
          'flex',
          'flex-row',
          'flex-1',
          'items-center',
          'justify-end'
        )}
      >
        <HeaderLink label="Home" href="/" />
        <HeaderLink label="About" href="/about" />
        <HeaderLink label="Blog" href="/blog" />
      </nav>
    </header>
  );
};
