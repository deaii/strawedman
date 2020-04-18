import Passage from './Passage';
import State from './State';

export default interface StoryData {
  /**
   * The state of the game. Reset when reloading the session, moving through
   * the session history, or saving or loading a session.
   */
  readonly state: State;

  /**
   * The ID/index of the passage currently displayed.
   */
  readonly passageName: string;

  /**
   * The passage being displayed.
   */
  readonly passage: Passage;

  /**
   * The text of the passage being displayed, after processing.
   */
  readonly text: string;

  /**
   * A number that is incremented on every page load.
   */
  readonly nonce: number;

  /**
   * Global data, persisting between sessions and unaffected
   * by save slots or history navigation.  Useful for player
   * settings and preferences.
   */
  readonly g: State;

  /**
   * Temporary variables, kept between rendering components but wiped
   * whenever a passage is loading.
   */
  readonly temp: State;

  readonly s: State;
  readonly __: State;
  readonly w: Window;
}
