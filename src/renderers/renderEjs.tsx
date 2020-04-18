import ejs from 'ejs';
import renderAttrs from './renderAttrs';

export const HREF_ATTR = 'data-passage';

export default function renderEjs(src: string, state: {}): string {
  let result = '';
  try {
    result = ejs.render(src, state);
  } catch (error) {
    window.events.storyError.trigger({ error, event: 'Passage.render() using _.template()' });
    return '';
  }

  /**
   * Transform class, ID, hidden, and link shorthands in HTML tags.
   * <a-0.class#id> becomes
   * <a href="javascript:void(0)" style="display: none" class="class" id="id">
   */
  /* eslint-disable no-useless-escape */
  return result.replace(/<([a-z]+)([\.#\-0].*?)(?=[\s>])/gi, (_match, tagName, attrs) => `<${tagName} ${renderAttrs(attrs)}`);
}
