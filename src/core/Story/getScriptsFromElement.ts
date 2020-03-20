import getTextFromElement from "./getTextFromElement";

export default function getScriptsFromElement(dataEl: HTMLElement): string[] {
  return getTextFromElement(dataEl, 'SCRIPT');
}