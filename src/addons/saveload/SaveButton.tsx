import React from 'react';
import SaveButtonProps from './SaveButtonProps';

function timestampToString(date: Date) {
  const fullString = date.toISOString();
  const dateStr = fullString.substring(0, 10);
  const timeStr = fullString.substring(11, 16);

  return `${dateStr} ${timeStr}`;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  slotName,
  timestamp,
  onSelect,
}) => (
  <button
    type="button"
    className="save-slot btn"
    onClick={onSelect}
  >
    <span className="name">{slotName}</span>
    <span className="date">{timestampToString(new Date(timestamp))}</span>
  </button>
);

export default SaveButton;
