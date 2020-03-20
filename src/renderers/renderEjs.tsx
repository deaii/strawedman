import ejs from 'ejs';
import { events } from "../core/Events";

export const HREF_ATTR = "data-passage";

export function renderEjs(src: string, state: {}): string {
  let result = "";
  try {
    result = ejs.render(src, state);
  }
  catch (error) {
    events.storyError.trigger({ error, event: "Passage.render() using _.template()" });
    return "";
  }
  /**
   * Transform class, ID, hidden, and link shorthands in HTML tags.
   * <a-0.class#id> becomes
   * <a href="javascript:void(0)" style="display: none" class="class" id="id">
   */
  /* eslint-disable no-useless-escape */
  result = result.replace(/<([a-z]+)([\.#\-0].*?)(?=[\s>])/gi, (_match, tagName, attrs) => {
    return "<" + tagName + " " + renderAttrs(attrs);
  });

  /* eslint-enable no-useless-escape */
  /* [[links]] with extra markup {#id.class} */
  result = result.replace(/\[\[(.*?)\]\]\{(.*?)\}/g, replaceTwineLink);

  /* Classic [[links]]  */
  return result.replace(/\[\[(.*?)\]\]/g, replaceTwineLink);
}

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
function renderAttrs(attrs: string): string {
  var result: string[] = [];

  for (var i = 0; attrs[i] === "-" || attrs[i] === "0"; i++) {
    switch (attrs[i]) {
      case "-":
        result.push('style="display:none" ');
        break;

      case "0":
        result.push('href="javascript:void(0)" ');
        break;
    }
  }

  var classes = [];
  var id = null;
  /* eslint-disable no-useless-escape */
  var classOrId = /([#\.])([^#\.]+)/g;
  /* eslint-enable no-useless-escape */
  var matches = classOrId.exec(attrs);

  while (matches !== null) {
    switch (matches[1]) {
      case "#":
        id = matches[2];
        break;

      case ".":
        classes.push(matches[2]);
        break;
    }

    matches = classOrId.exec(attrs);
  }

  if (id !== null) {
    result.push('id="' + id + '" ');
  }

  if (classes.length > 0) {
    result.push('class="' + classes.join(" ") + '"');
  }

  return result.join(" ").trim();
}

function printLink(display: string, target: string, attributes?: string){
  const attr = attributes ? renderAttrs(attributes) : '';

  return `<a href="javascript:void(0)" ${HREF_ATTR}="${encodeURI(target)}" ${attr}>${display}</a>`;
}

function replaceTwineLink(_match: string, replace: string, attrs?: string): string {
  let target = replace;
  let display = replace;

  // display|target format
  //
  const barIndex = replace.indexOf("|");

  if (barIndex !== -1) {
    display = replace.substr(0, barIndex);
    target = replace.substr(barIndex + 1);
    return printLink(display, target);
  }
  
  // text->target format
  //
  const rightArrIndex = target.indexOf("->");

  if (rightArrIndex !== -1) {
    display = target.substr(0, rightArrIndex);
    target = target.substr(rightArrIndex + 2);
    return printLink(display, target);
  } 
  
  // target<-display format
  //
  const leftArrIndex = target.indexOf("<-");

  if (leftArrIndex !== -1) {
    display = target.substr(leftArrIndex + 2);
    target = target.substr(0, leftArrIndex);
    return printLink(display, target);
  }

  return printLink(display, target);
}
