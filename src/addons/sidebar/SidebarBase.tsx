import React from 'react';
import SidebarProps from './SidebarProps';

const SidebarBase: React.FC<SidebarProps> = ({
  components,
  right,
  title,
  state,
  passageName,
  passage,
  text,
  nonce,
  g,
  temp,
  s,
  __,
  w,
}) => {
  const [stowed, setStowed] = React.useState<boolean>(true);
  const classNames = `${'sm-sidebar'} ${
    right ? 'sm-sidebar-right' : 'sm-sidebar-left'
  } ${stowed ? 'stowed' : ''}`;
  const childElms = components.map(({ FC, name }) => (
    <FC
      state={state}
      passageName={passageName}
      passage={passage}
      text={text}
      nonce={nonce}
      g={g}
      temp={temp}
      s={s}
      __={__}
      w={w}
      key={name}
    />
  ));
  const button = (
    <button
      className="sm-sidebar-toggle btn toggle"
      title={`Toggle ${title}`}
      type="button"
      onClick={() => setStowed(!stowed)}
    >
      {stowed !== !!right ? '▶' : '◀'}
    </button>
  );
  const titleElm = <div className="title">{title || 'Menu'}</div>;
  const header = (
    <div className="sm-sidebar-header">
      {right ? (
        <>
          {button}
          {titleElm}
        </>
      ) : (
        <>
          {titleElm}
          {button}
        </>
      )}
    </div>
  );
  return (
    <div className={classNames}>
      {header}
      <div className="body">{childElms}</div>
    </div>
  );
};

export default SidebarBase;
