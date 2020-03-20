import React from 'react';
import '../../App.css';
import './modal.css';

export interface ModalProps {
  title?: string;
  onX?: () => void,
  disabled?: boolean
}

export const Modal: React.FC<ModalProps> = ({ title, onX, disabled, children }) => {
  const header = onX || title
    ? (
      <div className="Game-Modal-Header">
        {title && <span className="Game-Modal-Title">{title}</span> }
        {onX && <button type="button" className="btn Game-Modal-X" onClick={onX}>🗙</button> }
      </div>
    ) : (<></>);

  return (
    <div className={`Game-Modal${disabled ? ' disabled' : ' not-blurred'}`} >
      {header}
      <div className="Game-Modal-Body">{children}</div>
    </div>
  );
};
