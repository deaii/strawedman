import { Story } from "./core/Story";
import Passage from "./core/Passage";

import './App.css';
import { Engine } from "./core/Engine";
import { renderEjs } from "./renderers/renderEjs";
import { MarkdownRenderer } from "./core/MarkdownRenderer";
import { Sidebar } from "./addons/Sidebar";
import { SaveLoad } from "./addons/saveload/saveLoad";

declare global {
  interface Window {
    story: Story;
    engine: Engine<any>;
    readonly state: any;
    readonly passage: Passage;
  }
}

Object.defineProperty(window, 'passage', {
  get: () => window.engine.data.passage
});

Object.defineProperty(window, 'state', {
  get: () => window.engine.data.state
})

window.addEventListener('load', () => {
  const dataElm = document.getElementsByTagName('tw-storydata')[0] as HTMLElement;
  const outElm = document.getElementById('root') as HTMLElement;

  window.story = new Story(dataElm);
  window.engine = new Engine(outElm, {}, renderEjs);

  const history = new SaveLoad();

  window.engine.addElement(Sidebar([history.getComponent()]));
  window.engine.addElement(MarkdownRenderer());

  window.engine.start();
});
