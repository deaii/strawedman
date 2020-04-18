/**
 * If the provided passage is in [[{passage}]] format, remove the outer square
 * brackets.
 */
export default function trimTwinePassage(passage: string) {
  if (passage.match(/^\[\[.*\]\]$/)) {
    return passage.substr(2, passage.length - 4);
  }
  return passage;
}
