import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { HeaderLink } from 'components/Link/HeaderLink';
import { LogoLink } from 'components/Link/LogoLink';

export const Header = () => {
  const [menuOpen, toggleMenu] = useState(false);

  const onClickHandler = () => toggleMenu(!menuOpen);

  return (
    <header
      className={classNames(
        'bg-white',
        'sm:px-20',
        'md:px-40',
        'xl:px-gutter',
        'flex',
        'flex-col',
        'md:flex-row',
        'border-solid',
        'border-b-2',
        'border-border'
      )}
    >
      <div className="flex justify-between">
        <LogoLink href="/" onClick={onClickHandler} />
        <button
          className="flex items-center p-2 md:hidden"
          onClick={() => toggleMenu(!menuOpen)}
        >
          <Image
            src="/menu.svg"
            alt="Menu toggle"
            width={25}
            height={25}
            className="md:hidden"
          />
        </button>
      </div>
      <div
        className={classNames(
          'flex',
          'md:flex',
          'flex-1',
          'items-center',
          'flex-row',
          'justify-end',
          'p-2',
          {
            hidden: !menuOpen,
          }
        )}
      >
        <HeaderLink label="Home" href="/" onClick={onClickHandler} />
        <HeaderLink label="About" href="/about" onClick={onClickHandler} />
        <HeaderLink label="Blog" href="/blog" onClick={onClickHandler} />
      </div>
    </header>
  );
};
