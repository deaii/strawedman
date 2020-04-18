import React from 'react';

import SidebarBase from "./SidebarBase";
import StoryData from '../../core/StoryData';
import SaveLoad from '../saveload/SaveLoad';

export default {
  title: 'Sidebar',
  component: SidebarBase,
};

const storyData: StoryData = {
  state: null!,
  passage: null!,
  passageName: 'Cheese',
  text: 'Text',
  nonce: 1,
  s: null!,
  __: null!,
  temp: null!,
  w: window,
  g: {},
};

export const SidebarLeft = () => (
  <SidebarBase
    {...storyData}
    title="Left Menu"
    components={[]}
  />
);

export const SidebarRight = () => (
  <SidebarBase
    {...storyData}
    title="Right Menu"
    components={[]}
    right
  />
);

export const BothBars = () => (
  <>
    {SidebarLeft()}
    {SidebarRight()}
  </>
);

export const SBWithHistory = () => {
  const saveLoad = new SaveLoad().getComponent();
  return (
    <SidebarBase
      components={[saveLoad]}
      title="Menu"
      {...storyData}
    />
  );
};
