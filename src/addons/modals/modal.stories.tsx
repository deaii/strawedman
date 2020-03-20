import React from 'react';
import { action } from '@storybook/addon-actions';
import { Modal } from './modal';
import { YesNoModal } from './YesNoModal';

export default {
  title: 'Modal',
  component: Modal
};

export const modal = () => <Modal title={'Modal Title'} onX={action('onX')}>Hello, world!</Modal>;

export const yesno = () => {
  const ynAction = action('Yes-No');
  return (
    <YesNoModal
      title="Test Title"
      text="Do you want to click the yes button?"
      onResult={(value: boolean) => ynAction(value)}
      yesText="Go Ahead"
      noText="Nay"
    />
  );
};