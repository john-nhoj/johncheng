import React from 'react';
import renderer from 'react-test-renderer';
import { Header } from 'components/Header/Header';

test('Header', () => {
  const header = renderer.create(<Header />);
  let tree = header.toJSON();
  expect(tree).toMatchSnapshot();
});
