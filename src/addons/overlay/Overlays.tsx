import React from 'react';

import Overlay from './Overlay';
import StoryData from '../../core/StoryData';
import OverlayFCParams from './OverlayFCParams';
import CreateOverlayFC from './CreateOverlayFC';
import SidebarButton from '../sidebar/SidebarButton';

type OverlayValue = [Overlay, React.FC<OverlayFCParams>];

export default class Overlays {
  #overlays: OverlayValue[] = [];

  add(overlay: Overlay) {
    this.#overlays.push([overlay, CreateOverlayFC(overlay)]);
  }

  getComponent(): React.FC<StoryData> {
    const self = this;

    return ({
      state,
    }: StoryData) => {
      const [selectedIndex, selectIndex] = React.useState<number>(-1);

      let modal = <></>;
      if (selectedIndex >= 0) {
        const X = self.#overlays[selectedIndex][1];
        modal = (
          <X
            state={state}
            onX={() => {
              window.setBlur(false);
              selectIndex(-1);
            }}
          />
        );
      }

      const buttons = self.#overlays.map((overlay, index) => (
        <SidebarButton
          title={overlay[0].title}
          onClick={() => {
            window.setBlur(true);
            selectIndex(index);
          }}
        />
      ));

      return (
        <>
          {buttons.length > 0
            ? <div className="sm-overlay-buttons">{buttons}</div>
            : <></>}
          {modal}
        </>
      );
    };
  }
}
