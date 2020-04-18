import React from 'react';
import Modal from '../modals/modal';
import SaveButton from './SaveButton';
import YesNoModal from '../modals/YesNoModal';
import NewSaveModal from './NewSaveModal';

import ModalBody from '../modals/ModalBody';
import ModalButtons from '../modals/ModalButtons';

import '../../css';
import SaveModalProps from './SaveModalProps';

const SaveModal: React.FC<SaveModalProps> = ({
  slots,
  checkSave,
  onDelete,
  onSave,
  onLoad,
  onCancel,
}) => {
  const [slot, setSlot] = React.useState<null | string>(null);
  const [newSave, setNewSave] = React.useState<boolean>(false);
  const [load, setLoad] = React.useState<boolean>(false);
  const [save, setSave] = React.useState<boolean>(false);
  const [del, setDelete] = React.useState<boolean>(false);

  const saveModal = save ? (
    <YesNoModal
      title="Confirm Overwrite"
      text={`Overright existing save slot '${slot}?'`}
      onResult={(value) => {
        setSave(false);

        if (value) {
          onSave(slot!);
          onCancel();
        }
      }}
    />
  ) : null;

  const deleteModal = del ? (
    <YesNoModal
      title="Confirm Delete"
      text={`Delete save slot '${slot}?'`}
      onResult={(value) => {
        setSlot(null);
        setDelete(false);
        if (value) {
          onDelete(slot!);
        }
      }}
    />
  ) : null;

  const loadModal = load ? (
    <YesNoModal
      title="Confirm Load"
      text={`Load save slot '${slot}?'  Your existing progress may be lost.`}
      onResult={(value) => {
        setSlot(null);
        setLoad(false);
        if (value) {
          onLoad(slot!);
        }
      }}
    />
  ) : null;

  const newSaveModal = newSave ? (
    <NewSaveModal
      onSave={(slotName) => {
        onSave(slotName);
      }}
      onCancel={() => {
        setNewSave(false);
      }}
      checkSave={checkSave}
    />
  ) : null;

  return (
    <>
      <Modal
        title="Save Files"
        onX={onCancel}
        disabled={!!(load || save || newSave || del)}
      >
        <ModalBody>
          <div className="save-slots">
            {slots.map(({ name, timestamp }) => (
              <div>
                <SaveButton
                  slotName={name}
                  timestamp={timestamp}
                  onSelect={() => setSlot(name)}
                />
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalButtons>
          <div className="modal-save-slot">
            {slot ? `Selected: ${slot}` : '--No Save Selected--'}
          </div>
          {/* New Save button */}
          <button
            type="button"
            className="btn"
            onClick={() => setNewSave(true)}
          >
            New Save
          </button>

          {/* Delete Button */}
          <button
            type="button"
            className="btn"
            onClick={() => setDelete(true)}
            disabled={!slot}
          >
            Delete
          </button>

          {/* Overwrite Save Button */}
          <button
            type="button"
            className="btn"
            onClick={() => {
              setSave(true);
            }}
            disabled={!slot}
          >
            Save
          </button>

          {/* Load Button */}
          <button
            type="button"
            className="btn"
            onClick={() => setLoad(true)}
            disabled={!slot}
          >
            Load
          </button>
        </ModalButtons>
        <ModalButtons>
          {/* Cancel Button */}
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        </ModalButtons>
      </Modal>
      {saveModal}
      {deleteModal}
      {loadModal}
      {newSaveModal}
    </>
  );
};

export default SaveModal;
