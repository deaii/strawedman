import React from 'react';
import Modal from '../modals/modal';
import ModalBody from '../modals/ModalBody';
import ModalButtons from '../modals/ModalButtons';
import Overlay from './Overlay';
import OverlayFCParams from './OverlayFCParams';

interface ExtendedParams extends OverlayFCParams, Overlay {}

const OverlayFC: React.FC<ExtendedParams> = ({
  markdown,
  title,
  onX,
  state,
}) => {
  const html = window.engine.process(markdown, state);

  return (
    <Modal onX={onX} title={title}>
      <ModalBody>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </ModalBody>
      <ModalButtons>
        {/* Cancel Button */}
        <button type="button" className="btn" onClick={onX}>
          Done
        </button>
      </ModalButtons>
    </Modal>
  );
};

export default OverlayFC;
