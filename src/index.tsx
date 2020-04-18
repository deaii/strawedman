import Story from './core/Story';
import Passage from './core/Passage';
import Engine from './core/Engine';
import renderEjs from './renderers/renderEjs';
import MarkdownRenderer from './addons/markdown/MarkdownRenderer';
import Sidebar from './addons/sidebar/Sidebar';
import SaveLoad from './addons/saveload/SaveLoad';
import setBlurrable from './addons/modals/Blurrable';

import './css';
import useCss from './addons/loaders/useCss';
import useJS from './addons/loaders/useJS';
import handleOverlay from './addons/overlay/handleOverlay';
import useItems from './addons/inventory/useInventory';
import useSegment from './addons/loaders/useSegment';
import Toggle from './addons/customElements/Toggle';
import setupAudioPlayer from './addons/audio/setupAudioPlayer';
import Link from './addons/customElements/Link';
import Compass from './addons/compass/Compass';
import { SetupGameEvents } from './core/Events';

declare global {
  interface Window {
    story: Story;
    engine: Engine;
    readonly state: any;
    readonly passage: Passage;
  }
}

Object.defineProperty(window, 'passage', {
  get: () => window.engine.data.passage,
});

Object.defineProperty(window, 'state', {
  get: () => window.engine.data.state,
});

window.addEventListener('load', () => {
  SetupGameEvents();
  const dataElms = document.getElementsByTagName('tw-storydata') as HTMLCollectionOf<HTMLElement>;
  const outElm = document.getElementById('root') as HTMLDivElement;

  setBlurrable(outElm);

  window.story = new Story(dataElms);
  window.engine = new Engine(
    outElm,
    renderEjs,
    window.story,
  );

  useCss();
  useJS();

  const history = new SaveLoad();
  setupAudioPlayer(document.getElementById('audio')!);

  window.engine.addElement(Sidebar('main-menu', 'Main Menu', false, history.getComponent(), handleOverlay()));
  window.engine.addElement(useSegment('header', /HEADER/i, 'sm-header'));
  window.engine.addElement(MarkdownRenderer(null, Toggle, Link, Compass));
  window.engine.addElement(useItems());
  window.engine.addElement(useSegment('footer', /FOOTER/i, 'sm-footer'));
  window.engine.start();
});
