import React from 'react';
import { Modal } from './modal';

export interface YesNoProps {
  title?: string;
  text: string;
  yesText?: string;
  noText?: string;
  onResult: (value: boolean) => void;
}

export const YesNoModal: React.FC<YesNoProps> = ({title, text, yesText, noText, onResult}) => (
  <Modal
    title={title}
    onX={() => onResult(false)}
  >
    <div>{text}</div>
    <div className='modal-buttons'>
      <button
        type="button"
        className="btn"
        onClick={() => onResult(true)}
      >
        {yesText || 'Yes'}
      </button>
      <button
        type="button"
        className="btn"
        onClick={() => onResult(false)}
      >
        {noText || 'No'}
      </button>
    </div>
  </Modal>
);