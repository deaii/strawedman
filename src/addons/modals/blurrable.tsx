import React from 'react';

let _blur = false;

declare global {
  interface Window {
    blur(setBlur?: boolean): void;
  }
}

window.blur = (val: boolean = true) => {
  _blur = true;
}

export const blurrable: React.FC<{}> = ({children}) => {
  return (
    <div className={`blurrable ${_blur ? 'blurred' : ''}`}>
      {children}
    </div>
  );
}
