import React from 'react';

import { events, PassageArgs } from '../../core/Events';
import { GameEventEmitter } from '../../core/GameEventEmitter';
import { StoryData } from '../../core/StoryData';
import { HistoryPage } from './HistoryPage';

import './History.css';
import { Story } from '../../core/Story';

export const BACK_ACTION = 'history-back';
export const FORWARD_ACTION = 'history-forward';
export const REFRESH_ACTION = 'history-refresh';
export const PUSH_ACTION = 'history-push';


const NO_CHECK_REGEX = /^NOCHECK(POINT)?$/
const CHECK_REGEX = /^CHECK(POINT)?$/

export class History<S extends {} = {}> {
  /**
   * If true, then the history is updated for every passage, except passages
   * with the NOCHECK or NOCHECKPOINT tag.
   * 
   * If false, then history is only updated for passages with the CHECK or
   * CHECKPOINT tag.
   */
  autoCheckPoint: boolean = true

  /**
   * The maximum size of the history, which can be used to revert state
   * by pushing the back button (in the UI or in the browser)
   */
  maxHistory: number = 50;

  /**
   * @property {Array} history - An array of passage IDs
   * @type {Array}
   * @readonly
   **/
  protected history: HistoryPage<S>[] = []

  /**
   * The current location in the user history.  If 'null' or undefined, then the
   * location is assumed to be the end of the history stack.
   */
  protected _index?: number | null;

  /**
   * The name of the CSS class for the component
   */
  protected className?: string;
  
  onNewPage = new GameEventEmitter<S>();
  onBack = new GameEventEmitter<S>();
  onForward = new GameEventEmitter<S>();

  public constructor(className?: string) {
    this.className = className;

    // When a story is restarted, clear the history.
    //
    events.storyStarted.on(() => {
      this.history = [];
    })

    events.passageShowing.on(this.onPassageShowing.bind(this));
    events.storyStarted.on(this.onStoryStarted.bind(this));
  }

  get index(): number {
    if (this._index != null) {
      return this._index;
    } else {
      return this.history.length - 1;
    }
  }

  get length(): number {
    return this.history.length;
  }

  protected show(page: HistoryPage<S>) {
    window.engine.show(page.passageId!, page.nonce, page.state);
  }

  protected onStoryStarted(story: Story){
    this.history = [];
  }

  protected onPassageShowing({passage, nonce, state}: PassageArgs) {
    const tags = passage.tags;
    let checkpoint = false;

    if (this.autoCheckPoint){
      checkpoint = !tags.some(tag => tag.match(NO_CHECK_REGEX));
    }else{
      checkpoint = !!tags.some(tag => tag.match(CHECK_REGEX));
    }

    if (checkpoint){
      this.push({passageId: passage.id, nonce, state});
    }
  }

  back(currentNonce: number) {
    if (this.history.length > 0) {
      let index = this.index;
      let page = this.history[index];

      if ((index > 0) && (currentNonce !== page.nonce)) {
        this._index = index - 1;
        page = this.history[this._index];
      }

      this.show(page);
    }
  }

  forward() {
    if ((this._index == null) || (this._index === (this.history.length - 1))) {
      return;
    }

    this._index += 1;
    this.show(this.history[this._index]);
  }

  getCurrentPage(): HistoryPage<S> | null {
    if (this.history.length === 0) {
      return null;
    }

    return this.history[this.index];
  }

  push(newState: HistoryPage<S>) {
    const newPage = {nonce: newState.nonce, passageId: newState.passageId, state: newState.state};

    if (this._index != null) {
      this.history = this.history.splice(this._index, this.history.length - this._index, newPage);
    } else {
      this.history.push(newPage)
    }

    if (this.history.length > this.maxHistory) {
      this.history = this.history.splice(0, this.history.length - this.maxHistory);
    }

    this._index = null;
  }

  getComponent(): React.FC<StoryData<S>> {
    var self = this;
    return React.memo(({nonce}) => {
      const index = self.index;
      const length = self.length;

      const goBack = (index > 0);
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
        />);
    });
  }
}

interface HistoryFCProps {
  className?: string,
  goBack?: boolean;
  goForward?: boolean;
  goBackClick?(): void;
  goForwardClick?(): void;
}

export const HistoryFC: React.FC<HistoryFCProps> = ({
  className,
  goBack,
  goForward,
  goBackClick,
  goForwardClick
}) => {
  return (
    <div className={className ? className : 'sm-history'}>
      <div className="History">History</div>
      <button 
        className="btn"
        type="button"
        title="Go back in the game's history"
        disabled={!goBack}
        onClick={goBackClick}
      >
        ⮜ Back
      </button>
      <span className="spacer" />
      <button 
        className="btn"
        type="button"
        title="Go forward in the game's history"
        disabled={!goForward}
        onClick={goForwardClick}
      >
        Forward ⮞
      </button>
    </div>);
};
