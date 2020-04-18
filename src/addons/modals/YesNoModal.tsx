import React from 'react';
import Modal from './modal';
import ModalBody from './ModalBody';
import ModalButtons from './ModalButtons';
import YesNoProps from './YesNoProps';

const YesNoModal: React.FC<YesNoProps> = ({
  title,
  text,
  yesText,
  noText,
  onResult,
}) => (
  <Modal title={title} onX={() => onResult(false)}>
    <ModalBody>{text}</ModalBody>
    <ModalButtons>
      <button type="button" className="btn" onClick={() => onResult(true)}>
        {yesText || 'Yes'}
      </button>
      <button type="button" className="btn" onClick={() => onResult(false)}>
        {noText || 'No'}
      </button>
    </ModalButtons>
  </Modal>
);

export default YesNoModal;
