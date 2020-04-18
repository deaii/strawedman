import React from 'react';
import ReactDOM from 'react-dom';

import { isNullOrUndefined } from 'util';
import StoryData from './StoryData';
import Story from './Story';
import State from './State';
import EngineComponent from './EngineComponent';

export default class Engine {
  /**
   * The DOM element on which the engine's UI will be rendered.
   */
  private renderElement: HTMLElement;

  #story?: Story;

  #processor: (src: string, state: State) => string;

  #parentElement?: React.FC<{}>;

  data!: StoryData;

  setInitialData?: () => State;

  setInitialGlobals?: (savedGlobals: State) => State;

  #elements: EngineComponent[] = [];

  /**
   * All passages in the story, indexed by name instead of ID.
   */
  private passageIdsByName: {[name: string]: number} = {};

  /**
   * All Passage IDs, in numerical order.  Useful for enumerating
   * passages for scripts and addons
   */
  private sortedPassageIds: number[] = [];

  #error?: string;

  public get story() {
    return this.#story || window.story;
  }

  public constructor(
    renderElement: HTMLElement,
    processor: (src: string, state: State) => string,
    story?: Story,
    parentElement?: React.FC<{}>,
  ) {
    this.renderElement = renderElement;
    this.#story = story;
    this.#processor = processor;
    this.#parentElement = parentElement;

    window.events.storyError.on((err) => {
      if (typeof err === 'object') {
        this.#error = JSON.stringify(err);
      } else {
        this.#error = err;
      }

      this.refresh();
    });
  }

  addElement(...elms: EngineComponent[]) {
    this.#elements.push(...elms);
  }

  /**
   * Begins playing this story.
   *
   * @function start
   * @param {Element} el - Element to show content in
   * @returns {void}
   * */
  async start(): Promise<void> {
    this.data = {
      state: this.setInitialData ? this.setInitialData() : {},
      g: this.setInitialGlobals ? this.setInitialGlobals({}) : {},
    } as StoryData;

    const { passages } = this.story;

    /* Index passages, removing undefined or null passages in the process just in case */
    this.sortedPassageIds = Object.keys(passages)
      .map((i: string) => parseInt(i, 10))
      .filter((i) => passages[i])
      .sort();

    this.passageIdsByName = {};

    this.sortedPassageIds.forEach((i: number) => {
      const psg = passages[i]!;
      if (psg) {
        this.passageIdsByName[psg.name] = i;
      }
    });

    window.events.storyStarted.trigger(this.story);

    this.sortedPassageIds.forEach((i: number) => {
      window.events.passageSetup.trigger(passages[i]);
    });

    /* Activate user styles. */
    window.story.userStyles.forEach((style) => {
      const stl = document.createElement('style');
      stl.innerHTML = style;
      document.body.appendChild(stl);
    });

    /* Run user scripts. */
    window.story.userScripts.forEach((script) => {
      try {
        // eslint-disable-next-line no-eval
        eval(script);
      } catch (error) {
        window.events.storyError.trigger({ error, event: 'Story JavaScript Eval()' });
      }
    });

    if (isNullOrUndefined(this.data.passageName)) {
      this.show(window.story.startPassage);
    } else {
      this.show(this.data.passageName);
    }
  }

  async show(passageName: string, nonce?: number, state?: State) {
    if (!this.story.finishedLoading) {
      this.story.finishLoading();
    }

    if (this.data.passage) {
      window.events.passageHidden.trigger(this.data);
    }

    const newState = { ...(state || this.data.state) };
    const passage = this.story.passages[passageName];
    const newNonce = isNullOrUndefined(nonce) ? ((this.data.nonce || 0) + 1) : nonce;

    window.events.passageProcessing.trigger({ passage, nonce: newNonce, state: newState });

    const text = this.#processor(passage.source, newState);

    const tmp = {};

    this.data = {
      state: newState,
      passageName,
      passage,
      text,
      nonce: newNonce,
      s: newState,
      temp: tmp,
      __: tmp,
      w: window,
      g: this.data.g,
    };

    window.events.passageShowing.trigger(this.data);

    this.refresh();
  }

  public process(inStr: string, state?: State): string {
    return this.#processor(inStr, state || this.data.state);
  }

  public refresh() {
    const {
      state,
      passageName,
      passage,
      text,
      nonce,
      s,
      temp,
      __,
      w,
      g,
    } = this.data;

    const elms = this.#elements.map(({ FC, name }) => (
      <FC
        state={state}
        passageName={passageName}
        passage={passage}
        text={text}
        nonce={nonce}
        s={s}
        temp={temp}
        __={__}
        w={w}
        g={g}
        key={name}
      />
    ));

    if (this.#error) {
      ReactDOM.render(
        <div className="error">{this.#error}</div>,
        this.renderElement,
      );
    } else if (this.#parentElement) {
      ReactDOM.render(
        React.createElement(this.#parentElement, {}, ...elms),
        this.renderElement,
      );
    } else {
      ReactDOM.render(
        <>{elms}</>,
        this.renderElement,
      );
    }
  }
}
