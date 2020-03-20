import React from 'react';
import ReactDOM from 'react-dom';

import { StoryData } from "./StoryData";
import { Story } from "./Story";
import { events } from "./Events";
import { isNullOrUndefined } from "util";

export class Engine<D extends {} = {}> {
  /**
   * The DOM element on which the engine's UI will be rendered.
   */
  private renderElement: HTMLElement;
  private _story?: Story;
  private _processor: (src: string, state: D) => string;

  private _parentElement?: React.FC<{}>;

  data: StoryData<D>;

  private _elements: React.FC<StoryData<D>>[] = [];

  /**
   * All passages in the story, indexed by name instead of ID.
   */
  private passageIdsByName: {[name: string]: number} = {};

  /**
   * All Passage IDs, in numerical order.  Useful for enumerating
   * passages for scripts and addons
   */
  private sortedPassageIds: number[] = [];

  public get story() {
    return this._story || window.story;
  }

  public constructor(
    renderElement: HTMLElement,
    initialState: D, 
    processor: (src: string, state: D) => string, 
    story?: Story,
    parentElement?: React.FC<{}>
  ) {
    this.renderElement = renderElement;
    this._story = story;
    this._processor = processor;
    this._parentElement = parentElement;

    this.data = {
      state: initialState
    } as StoryData<D>;
  }

  addElement(...elms: React.FC<StoryData<D>>[]){
    this._elements.push(...elms);
  }

/**
   * Begins playing this story.
   *
   * @function start
   * @param {Element} el - Element to show content in
   * @returns {void}
   **/
  async start (): Promise<void> {
    const passages = this.story.passages;

    /* Index passages, removing undefined or null passages in the process just in case */
    this.sortedPassageIds = Object.keys(passages)
      .map((i: string) => parseInt(i))
      .filter((i) => passages[i])
      .sort();

    this.passageIdsByName = {};

    this.sortedPassageIds.forEach((i: number) => {
      const psg = passages[i]!;
      if (psg) {
        this.passageIdsByName[psg.name] = i;
      }
    });

    events.storyStarted.trigger(this.story);

    this.sortedPassageIds.forEach((i: number) => {
      events.passageSetup.trigger(passages[i]);
    })

    /* Activate user styles. */
    window.story.userStyles.forEach((style) => {
      const stl = document.createElement('style');
      stl.innerHTML = style;
      document.body.appendChild(stl)
    });

    /* Run user scripts. */
    window.story.userScripts.forEach((script) => {
      try {
        // eslint-disable-next-line no-eval
        // eval(script);
      } catch (error) {
        events.storyError.trigger({error, event: 'Story JavaScript Eval()'})
      }
    });

    if (isNullOrUndefined(this.data.passageId)){
      this.show(window.story.startPassage);
    }else{
      this.show(this.data.passageId);
    }
  }

  async show(passageNameOrId: number | string, nonce?: number, state?: D ){
    let passageId: number;
    if (typeof passageNameOrId === "number"){
      passageId = passageNameOrId;
    } else {
      passageId = this.passageIdsByName[passageNameOrId];
    }

    if (this.data.passage){
      events.passageHidden.trigger(this.data);
    }

    var newState = {...(state || this.data.state)};
    var passage = this.story.passages[passageId];
    var newNonce = nonce || ((this.data.nonce || 0) + 1);

    events.passageProcessing.trigger({passage, nonce: newNonce, state: newState});

    var passageText = this._processor(passage.source, newState);

    this.data = {
      state: this.data.state,
      passageId: passageId,
      passage: this.story.passages[passageId],
      text: passageText,
      nonce: this.data.nonce + 1,
    }

    const elms = this._elements.map((X, i) => (
      <X {...this.data} key={`this._elements[${i}]`} />
    ));

    if (this._parentElement){
      ReactDOM.render(
        React.createElement(this._parentElement, {}, ...elms),
        this.renderElement
      );
    }else{
      ReactDOM.render(
        <>{elms}</>, 
        this.renderElement,
      );
    }
  }
}