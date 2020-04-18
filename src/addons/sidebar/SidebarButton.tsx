import React from 'react';
import SidebarButtonProps from './SidebarButtonProps';

const SidebarButton: React.FC<SidebarButtonProps> = ({
  title,
  onClick,
  children,
}) => (
  <button
    type="button"
    className="btn sm-sidebar-button"
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
);

export default SidebarButton;
