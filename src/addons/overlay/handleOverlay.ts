import toml from 'toml';
import Overlay from './Overlay';
import Overlays from './Overlays';
import EngineComponent from '../../core/EngineComponent';

const OVERLAY_TOML_TAGS = /^OVERLAY(_TOML)?$/i;
const OVERLAY_JSON_TAGS = /^OVERLAY_JSON$/i;

declare global {
  interface Window {
    overlays: Overlays;
  }
}

export default function handleOverlay(): EngineComponent {
  const overlays = new Overlays();
  window.overlays = overlays;

  window.events.storyLoaded.on((story) => {
    story.sortedPassages.forEach((psg) => {
      if (psg.tags) {
        let obj: Overlay;

        if (psg.tags.some((t) => t.match(OVERLAY_JSON_TAGS))) {
          obj = JSON.parse(psg.source);
        } else if (psg.tags.some((t) => t.match(OVERLAY_TOML_TAGS))) {
          obj = toml.parse(psg.source);
        } else {
          return;
        }

        if (obj.markdown && obj.title) {
          overlays.add(obj);
        }

        story.userScripts.push(psg.source);
      }
    });
  });

  return {
    FC: overlays.getComponent(),
    name: 'overlays',
  };
}
