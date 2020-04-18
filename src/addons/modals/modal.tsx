import React from 'react';

import ModalProps from './ModalProps';

import '../../css';

const Modal: React.FC<ModalProps> = ({
  title, onX, disabled, children,
}) => {
  const header = onX || title
    ? (
      <div className="sm-modal-header">
        {title && <span className="sm-modal-title">{title}</span> }
        {onX && <button type="button" className="btn sm-modal-x" onClick={onX}>🗙</button> }
      </div>
    ) : (<></>);

  return (
    <div className={`sm-modal ${disabled ? 'blurred disabled' : 'not-blurred'}`}>
      {header}
      {children}
    </div>
  );
};

export default Modal;
