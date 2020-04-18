import React from 'react';

import PassageArgs from '../../core/PassageArgs';
import StoryData from '../../core/StoryData';
import HistoryPage from './HistoryPage';
import HistoryFC from './HistoryFC';

import '../../css';
import EngineComponent from '../../core/EngineComponent';

const NO_CHECK_REGEX = /^NOCHECK(POINT)?$/;
const CHECK_REGEX = /^CHECK(POINT)?$/;

export default class History {
  /**
   * If true, then the history is updated for every passage, except passages
   * with the NOCHECK or NOCHECKPOINT tag.
   *
   * If false, then history is only updated for passages with the CHECK or
   * CHECKPOINT tag.
   */
  autoCheckPoint: boolean = true;

  /**
   * The maximum size of the history, which can be used to revert state
   * by pushing the back button (in the UI or in the browser)
   */
  maxHistory: number = 50;

  /**
   * @property {Array} history - An array of passage IDs
   * @type {Array}
   * @readonly
   * */
  protected history: HistoryPage[] = [];

  /**
   * The current location in the user history.  If 'null' or undefined, then the
   * location is assumed to be the end of the history stack.
   */
  #index?: number | null;

  /**
   * The name of the CSS class for the component
   */
  protected className?: string;

  public constructor(className?: string) {
    this.className = className;

    // When a story is restarted, clear the history.
    //
    window.events.storyStarted.on(() => {
      this.history = [];
    });

    window.events.passageProcessing.on(this.onPassageShowing.bind(this));
    window.events.storyStarted.on(this.onStoryStarted.bind(this));
  }

  get index(): number {
    if (this.#index != null) {
      return this.#index;
    }
    return this.history.length - 1;
  }

  get length(): number {
    return this.history.length;
  }

  protected static show({ passageName, nonce, state }: HistoryPage) {
    window.engine.show(passageName, nonce, state);
  }

  protected onStoryStarted() {
    this.history = [];
  }

  protected onPassageShowing({ passage, nonce, state }: PassageArgs) {
    const { tags } = passage;
    let checkpoint = false;

    if (this.autoCheckPoint) {
      checkpoint = !tags.some((tag) => tag.match(NO_CHECK_REGEX));
    } else {
      checkpoint = !!tags.some((tag) => tag.match(CHECK_REGEX));
    }

    if (checkpoint) {
      this.push({ passageName: passage.name, nonce, state });
    }
  }

  back(currentNonce: number) {
    if (this.history.length > 0) {
      const { index } = this;
      let page = this.history[index];

      if ((index > 0) && (currentNonce === page.nonce)) {
        this.#index = index - 1;
        page = this.history[this.#index];
      }

      History.show(page);
    }
  }

  forward() {
    if ((this.#index == null) || (this.#index === (this.history.length - 1))) {
      return;
    }

    this.#index += 1;
    History.show(this.history[this.#index]);
  }

  fastForward() {
    this.#index = null;
    History.show(this.getCurrentPage()!);
  }

  getCurrentPage(): HistoryPage | null {
    if (this.history.length === 0) {
      return null;
    }

    return this.history[this.index];
  }

  push(newState: HistoryPage) {
    const lastPage = this.history.length > 0
      ? this.history[this.index]
      : null;

    if (lastPage && (lastPage.nonce === newState.nonce)) {
      // Don't push the same page twice.
      return;
    }

    const newPage = {
      nonce: newState.nonce,
      passageName: newState.passageName,
      state: newState.state,
    };

    if (this.#index != null) {
      this.history = this.history.splice(this.#index, this.history.length - this.#index, newPage);
    } else {
      this.history.push(newPage);
    }

    if (this.history.length > this.maxHistory) {
      this.history = this.history.splice(0, this.history.length - this.maxHistory);
    }

    this.#index = null;
  }

  getComponent(): EngineComponent {
    const self = this;
    const fc = React.memo(({ nonce }: StoryData) => {
      const { index } = self;
      const { length } = self;

      const goBack = (index > 0) && (self.history[0].nonce !== nonce);
      const goForward = (index + 1) < length;

      const goBackClick = () => self.back(nonce);
      const goForwardClick = () => self.forward();

      return (
        <HistoryFC
          className={self.className}
          goBackClick={goBackClick}
          goForwardClick={goForwardClick}
          goBack={goBack}
          goForward={goForward}
        />
      );
    });

    return {
      FC: fc,
      name: 'History',
    };
  }
}
