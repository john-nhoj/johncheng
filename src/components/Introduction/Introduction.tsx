import classNames from 'classnames';
import React from 'react';
import Image from 'next/image';
import { theme } from 'styles/tailwind';

const Introduction = () => {
  const {
    height: { screen, header },
  } = theme;

  return (
    <section
      className={classNames(
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'hero-banner'
      )}
    >
      <Image
        src="/memoji.svg"
        alt="Memoji of John Cheng"
        width={190}
        height={190}
      />
      <div
        className={classNames(
          'flex',
          'justify-center',
          'mt-4',
          'text-4xl',
          'lg:text-5xl'
        )}
      >
        Hi, I'm John&nbsp;
        <span role="img" aria-label="Waving emoji">
          &#128075;
        </span>
      </div>
      <div
        className={classNames(
          'flex',
          'justify-center',
          'text-center',
          'mt-10',
          'text-2xl',
          'lg:text-3xl'
        )}
      >
        I am a Software Engineer and Badminton Enthusiast.
      </div>
      <style jsx={true}>{`
        .hero-banner {
          min-height: calc(${screen} - ${header});
        }
      `}</style>
    </section>
  );
};

export { Introduction };
