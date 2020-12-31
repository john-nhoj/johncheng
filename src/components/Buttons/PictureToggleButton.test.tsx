import React from 'react';
import renderer from 'react-test-renderer';
import { PictureToggleButton } from './PictureToggleButton';

test('Picture toggle button', () => {
  const header = renderer.create(
    <PictureToggleButton label="Toggle button" onClickHandler={() => {}} />
  );
  let tree = header.toJSON();
  expect(tree).toMatchSnapshot();
});
