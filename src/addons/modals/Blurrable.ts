
let ref: null | HTMLDivElement = null;

declare global {
  interface Window {
    setBlur(setBlur: boolean): void;
  }
}

window.setBlur = (val: boolean) => {
  if (val) {
    ref!.classList.add('blurred');
  } else {
    ref!.classList.remove('blurred');
  }
};

export default function setBlurrable(elm: HTMLDivElement) {
  ref = elm;
}
