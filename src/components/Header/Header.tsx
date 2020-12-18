import React from 'react';

type HeaderLinkProps = {
  label: string;
  link: string;
};

const HeaderLink = ({ label, link }: HeaderLinkProps) => (
  <a href={link} className="p-4 h-full">
    {label}
  </a>
);

export const Header = () => (
  <header className="bg-black text-white flex flex-wrap">
    <HeaderLink label="Home" link="/" />
    <HeaderLink label="About" link="/about" />
    <HeaderLink label="Blog" link="/blog" />
  </header>
);
