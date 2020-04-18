import React from 'react';

import '../../css/itemButton.css';

export interface ItemButtonProps {
  id: string;
  name: string;
  image: string;
  onClick(): void;
  count?: number;
}

export const ItemButton: React.FC<ItemButtonProps> = ({
  id,
  name,
  image,
  onClick,
  count,
}) => {
  const badge = (count && (count > 1))
    ? <span className="sm-item-badge">{count}</span>
    : null;
  return (
    <button
      type="button"
      id={id}
      className="sm-item-button"
      onClick={onClick}
      style={{ backgroundImage: `url(${image})` }}
      title={name}
    >
      {badge}
    </button>
  );
};
