export default interface CustomElement {
  name: RegExp;
  callback: (elm: Element, state: {[key: string]: any}, reload: () => void) => void;
}
