/**
 * An object representing the entire story. After the document has completed
 * loading, an instance of this class will be available at `window.story`.
 *
 * @class Story
 */
export interface StoryError {
  event: string | Event;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
}
