import React from 'react';
import { action } from '@storybook/addon-actions';
import { ItemButton } from './ItemButton';

import png from './noisy.png';

export default {
  title: 'Item Button',
  component: ItemButton,
};

export const Button = () => (
  <ItemButton
    id="FakeItem"
    name="Fake Item"
    image={png}
    onClick={action('Button')}
  />
);

export const CountedButton = () => {
  const [count, setCount] = React.useState<number>(0);

  return (
    <div>
      <h1>Click the button to increment.</h1>
      <ItemButton
        id="FakeItem"
        name="Fake Item"
        image={png}
        onClick={() => setCount(count + 1)}
        count={count}
      />
    </div>
  );
};
