import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { HeaderLink } from 'components/Link/HeaderLink';
import { LogoLink } from 'components/Link/LogoLink';

export const Header = () => {
  const [menuOpen, setMenuState] = useState(false);

  const closeMenu = () => setMenuState(false);
  const toggleMenu = () => setMenuState(!menuOpen);

  return (
    <header
      className={classNames(
        'bg-white',
        'border-solid',
        'border-b-2',
        'border-border'
      )}
    >
      <div
        className={classNames(
          'flex',
          'flex-col',
          'md:flex-row',
          'layout__margin--horizontal'
        )}
      >
        <div className="flex justify-between">
          <LogoLink href="/" onClick={closeMenu} />
          <button
            className="flex items-center p-2 md:hidden"
            onClick={toggleMenu}
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
            // The second `md:flex` is needed if user changes the viewport in responsive mode for example.
            'md:flex',
            'flex-1',
            'items-center',
            'flex-row',
            'justify-end',
            {
              hidden: !menuOpen,
            }
          )}
        >
          <HeaderLink label="Home" href="/" onClick={closeMenu} />
          <HeaderLink label="About" href="/about" onClick={closeMenu} />
          <HeaderLink label="Blog" href="/blog" onClick={closeMenu} />
        </div>
      </div>
    </header>
  );
};
