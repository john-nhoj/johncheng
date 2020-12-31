import React from 'react';
import renderer from 'react-test-renderer';
import { Introduction } from 'components/Introduction/Introduction';

test('Introduction Section', () => {
  const header = renderer.create(<Introduction />);
  let tree = header.toJSON();
  expect(tree).toMatchSnapshot();
});
