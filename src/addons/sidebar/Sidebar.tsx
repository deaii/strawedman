import React from 'react';
import StoryData from '../../core/StoryData';

import '../../css';
import EngineComponent from '../../core/EngineComponent';
import SidebarBase from './SidebarBase';

export default function Sidebar(
  id: string,
  title: string,
  isRightBar: boolean,
  ...components: EngineComponent[]
): EngineComponent {
  return {
    FC: React.memo<StoryData>(
      ({ state, passageName, passage, text, nonce, g, temp, s, __, w }) => (
        <SidebarBase
          title={title}
          right={isRightBar}
          components={components}
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
        />
      ),
    ),
    name: id,
  };
}
