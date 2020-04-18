import React from 'react';
import { action } from '@storybook/addon-actions';

import SaveButton from './SaveButton';
import SaveModal from './SaveModal';

export default {
  title: 'Save Button',
  component: SaveButton,
};

export const SingleButton = () => (
  <SaveButton
    slotName="Slot 1"
    timestamp={new Date().getTime()}
    onSelect={action('SaveButton-Select')}
  />
);

export const FullSaveModal = () => {
  const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
    name: `Slot ${i}`,
    timestamp: new Date().getTime(),
  }));

  const confirmLoad = action('confirming load');
  const confirmSave = action('confirming save');
  const confirmDelete = action('confirming delete');

  return (
    <SaveModal
      slots={slots}
      onLoad={(slot) => confirmLoad({ slot })}
      onSave={(slot) => confirmSave({ slot })}
      checkSave={() => { action('checking save'); return true; }}
      onCancel={action('cancelling')}
      onDelete={(slot) => confirmDelete({ slot })}
    />
  );
};

export const EmptySaveModal = () => {
  const confirmLoad = action('confirming load');
  const confirmSave = action('confirming save');
  const confirmDelete = action('confirming delete');

  return (
    <SaveModal
      slots={[]}
      onLoad={(slot) => confirmLoad({ slot })}
      onSave={(slot) => confirmSave({ slot })}
      checkSave={() => true}
      onCancel={action('cancelling')}
      onDelete={(slot) => confirmDelete({ slot })}
    />
  );
};
