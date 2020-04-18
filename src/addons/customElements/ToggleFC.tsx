import React from 'react';
import ReactToggle from 'react-toggle';
import ToggleParams from './ToggleParams';

const CustomFC: React.FC<ToggleParams> = ({
  id,
  label,
  defaultChecked: defaultValue,
  onChange,
}) => (
  <span className="sm-toggle">
    <ReactToggle
      id={id}
      defaultChecked={defaultValue}
      onChange={(ev) => onChange(ev.currentTarget.checked)}
    />
    <label htmlFor={id}>{label}</label>
  </span>
);

export default CustomFC;
