import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
type HeaderLinkProps = {
  label: string;
  link: string;
  className?: string;
};

const HeaderLink = ({ label, link, className }: HeaderLinkProps) => (
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

export const Header = () => {
  const [menuOpen, toggleMenu] = useState(false);

  return (
    <header
      className={classNames(
        'bg-white',
        'sm:px-20',
        'md:px-40',
        'xl:px-96',
        'flex',
        'flex-col',
        'md:flex-row',
        'border-solid',
        'border-b-2',
        'border-border'
      )}
    >
      <div className="flex justify-between">
        <a
          href="/"
          className={classNames('flex', 'items-center', 'p-2', 'md:p-4')}
        >
          <Image src="/logo.svg" alt="Website logo" width={200} height={28} />
        </a>
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
        <HeaderLink label="Home" link="/" />
        <HeaderLink label="About" link="/about" />
        <HeaderLink label="Blog" link="/blog" />
      </div>
    </header>
  );
};
