import React from 'react';

import { SidebarBase } from './Sidebar';
import { StoryData } from '../core/StoryData';
import { HistoryFC } from './history/History';
import { SaveLoad } from './saveload/saveLoad';

export default {
  title: 'Sidebar',
  component: SidebarBase,
};

const storyData: StoryData = {
  state: null!,
  passage: null!,
  passageId: 1,
  text: "Text",
  nonce: 1,
}

export const SB = () => (
  <SidebarBase
    {...storyData}
    components={[]}
  />
);

export const SBWithHistory = () => {
  const saveLoad = new SaveLoad().getComponent();
  return (
    <SidebarBase
      components={[saveLoad]}
      state={null!}
      passage={null!}
      passageId={1}
      text="Text"
      nonce={1}
    /> 
  );
};
