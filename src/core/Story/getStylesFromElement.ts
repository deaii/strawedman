import getTextFromElement from './getTextFromElement';

export default function getStylesFromElement(dataEl: HTMLElement): string[] {
  return getTextFromElement(dataEl, 'STYLE');
}
