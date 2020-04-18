import React, { FormEvent } from 'react';
import Modal from '../modals/modal';
import YesNoModal from '../modals/YesNoModal';
import ModalBody from '../modals/ModalBody';
import ModalButtons from '../modals/ModalButtons';
import NewSaveModalProps from './NewSaveModalProps';

const NewSaveModal: React.FC<NewSaveModalProps> = ({
  checkSave,
  onCancel,
  onSave,
}) => {
  const [slotName, setSlotName] = React.useState<string>('');
  const [confirm, setConfirm] = React.useState<boolean>(false);

  const onFormSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (slotName) {
      if (checkSave(slotName)) {
        setConfirm(true);
      } else {
        onSave(slotName);
        onCancel();
      }
    }
  };

  const confirmModal = confirm ? (
    <YesNoModal
      title="Confirm Overwrite"
      text={`Save File '${slotName}' exists.  Overwrite?`}
      onResult={(result) => {
        setConfirm(false);
        if (result) {
          onSave(slotName);
          onCancel();
        }
      }}
    />
  ) : null;

  return (
    <>
      <Modal title="New Save" onX={() => onCancel()} disabled={confirm}>
        <form onSubmit={onFormSubmit}>
          <ModalBody>
            <label htmlFor="sm-slotname-textbox">
              Slot Name:
              <input
                id="sm-slotname-textbox"
                type="textbox"
                value={slotName}
                onChange={(ev) => setSlotName(ev.target.value)}
              />
            </label>
          </ModalBody>
          <ModalButtons>
            <input
              className="btn"
              type="submit"
              value="Save"
              disabled={!slotName}
            />
            <button className="btn" type="button" onClick={onCancel}>
              Cancel
            </button>
          </ModalButtons>
        </form>
      </Modal>
      {confirmModal}
    </>
  );
};

export default NewSaveModal;
