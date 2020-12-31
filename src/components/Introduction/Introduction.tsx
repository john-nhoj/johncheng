import classNames from 'classnames';
import React, { useState } from 'react';
import Image from 'next/image';
import { PictureToggleButton } from 'components/Buttons/PictureToggleButton';

const Introduction = () => {
  const [showChillPicture, togglePicture] = useState(false);

  const showBusinessPicture = () => togglePicture(false);
  const showPicture = () => togglePicture(true);

  return (
    <div
      className={classNames(
        'flex',
        'layout__padding--full',
        'mt-8',
        'justify-center',
        'items=center'
      )}
    >
      <div
        className={classNames(
          'flex',
          'flex-col',
          'justify-center',
          'items-center',
          'text-center'
        )}
      >
        <h2 className={classNames('text-5xl', 'font-bold')}>John Cheng</h2>
        <p
          className={classNames(
            'uppercase',
            'mt-4',
            'flex',
            'flex-col',
            'xl:flex-row',
            'items-center'
          )}
        >
          <PictureToggleButton
            onClickHandler={showBusinessPicture}
            label="Software Developer"
          />{' '}
          and{' '}
          <PictureToggleButton
            onClickHandler={showPicture}
            label="badminton player"
          />
        </p>
      </div>
      <div className={classNames('hidden', 'md:flex', 'ml-24')}>
        <Image
          src={showChillPicture ? '/chill_me.jpeg' : '/johncheng.jpg'}
          alt="Picture of site owner"
          width={300}
          height={300}
          className={classNames('rounded-xl')}
        />
      </div>
    </div>
  );
};

export { Introduction };
