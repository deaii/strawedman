import React from "react";
import { StoryData } from "../core/StoryData";

import "./Sidebar.css";
import "./modals/modal.css";
import "../App.css";

export interface SidebarProps extends StoryData {
  className?: string;
  title?: string;
  components: React.FC<StoryData>[];
}

export function Sidebar(
  components: React.FC<StoryData>[],
  title?: string,
  className?: string
) {
  return React.memo<StoryData>(props => (
    <SidebarBase
      className={className}
      title={title}
      components={components}
      {...props}
    />
  ));
}

export const SidebarBase: React.FC<SidebarProps> = ({
  className,
  components,
  title,
  state,
  passageId,
  passage,
  text,
  nonce
}) => {
  const [stowed, setStowed] = React.useState<boolean>(false);

  const classNames = `${className || "sm-sidebar"} ${stowed ? "stowed" : ""}`;

  const childElms = components.map(x =>
    React.createElement(x, { state, passageId, passage, text, nonce })
  );

  const button = (
    <button
      className={`${className}-button btn toggle`}
      title="Toggle the UI bar"
      aria-label="Toggle the UI bar"
      type="button"
      onClick={() => setStowed(!stowed)}
    >
      {stowed ? "▶" : "◀"}
    </button>
  );

  const header = (
    <div className="header">
      <div className="title">{title || "Menu"}</div>
      {button}
    </div>
  );

  return (
    <div className={classNames}>
      {header}
      <div className="body">{childElms}</div>
    </div>
  );
};
