import Passage from "./Passage";

export interface StoryData<S extends object = {}> {
  /**
   * The state of the game. Reset when reloading the session, moving through
   * the session history, or saving or loading a session.
   */
  state: S;

  /**
   * The ID/index of the passage currently displayed.
   */
  passageId: number;

  /**
   * The passage being displayed.
   */
  passage: Passage;

  /**
   * The text of the passage being displayed, after processing.
   */
  text: string;

  /**
   * A number that is incremented on every page load.
   */
  nonce: number;
}
