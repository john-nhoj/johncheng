import classNames from 'classnames';
import React from 'react';

const PictureToggleButton = ({
  onClickHandler,
  label,
}: {
  onClickHandler: () => void;
  label: string;
}) => (
  <button className="relative m-2 uppercase" onClick={onClickHandler}>
    <div
      className={classNames(
        'absolute',
        'bg-red',
        'w-full',
        'h-full',
        'transform',
        '-skew-x-12',
        '-z-10'
      )}
    ></div>
    <span className={classNames('p-2')}>{label}</span>
  </button>
);

export { PictureToggleButton };
