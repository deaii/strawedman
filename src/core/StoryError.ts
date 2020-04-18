
export default interface StoryError {
  event: string | Event;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
}
