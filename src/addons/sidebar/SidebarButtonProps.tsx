import { MouseEventHandler } from 'react';

export default interface SidebarButtonProps {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
