import printLink from './printLink';
import extractTwineLink from './extractTwineLink';

export default function replaceTwineLink(
  _match: string,
  text: string,
  attrs?: string,
): string {
  const {display, target} = extractTwineLink(text);
  return printLink(display, target, attrs);
}
