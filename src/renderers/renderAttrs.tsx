/**
 * An internal helper function that converts markup like #id.class into HTML
 * attributes.
 *
 * @function renderAttrs
 * @private
 * @param {string} attrs - an attribute shorthand, i.e. #myId.className. There are
 *  two special leading prefixes: - (minus) will hide an element, and 0 will
 *  give it a href property that does nothing.
 * @returns {string} HTML source code
 */
export default function renderAttrs(attrs: string): string {
  const result: string[] = [];
  for (let i = 0; attrs[i] === '-' || attrs[i] === '0'; i += 1) {
    switch (attrs[i]) {
      case '-':
        result.push('style="display:none" ');
        break;
      case '0':
        result.push('href="javascript:void(0)" ');
        break;
      default:
        break;
    }
  }
  const classes = [];
  let id = null;
  const classOrId = /([#.])([^#.]+)/g;
  let matches = classOrId.exec(attrs);
  while (matches !== null) {
    const [, symbol, name] = matches;
    switch (symbol) {
      case '#':
        id = name;
        break;
      case '.':
        classes.push(name);
        break;
      default:
        break;
    }
    matches = classOrId.exec(attrs);
  }
  if (id !== null) {
    result.push(`id="${id}" `);
  }
  if (classes.length > 0) {
    result.push(`class="${classes.join(' ')}"`);
  }
  return result.join(' ').trim();
}
