import React from 'react';

export interface CompassButtonProps {
  className: string;
  title: string;
  label: string;
  passage?: string;
  onClick(passage: string): void;
}

const CompassButton: React.FC<CompassButtonProps> = ({
  className,
  title,
  label,
  passage,
  onClick,
}) => (
  <button
    type="button"
    className={`btn ${className}`}
    title={title}
    onClick={!passage ? undefined : () => onClick(passage)}
    disabled={!passage}
  >
    {label}
  </button>
);

export default CompassButton;
