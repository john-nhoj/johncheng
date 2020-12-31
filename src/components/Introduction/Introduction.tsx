import classNames from 'classnames';
import React from 'react';
import Image from 'next/image';

const Introduction = () => {
  return (
    <div className={classNames('flex', 'layout__padding--full', 'mt-8')}>
      <div
        className={classNames('flex', 'flex-col', 'flex-1', 'justify-center')}
      >
        <h2 className={classNames('text-5xl', 'font-bold')}>John Cheng</h2>
        <p className={classNames('uppercase', 'mt-2')}>
          Software Developer and badminton player
        </p>
      </div>
      <Image
        src="/johncheng.jpg"
        alt="Picture of site owner"
        width={300}
        height={300}
        className="rounded-xl"
      />
    </div>
  );
};

export { Introduction };
