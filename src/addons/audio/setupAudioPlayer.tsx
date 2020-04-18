import AudioPlayer from './AudioPlayer';

export default function setupAudioPlayer(
  elm: HTMLElement,
  urlTransformer?: (url: string) => string,
) {
  window.audio = new AudioPlayer(elm, urlTransformer);
  return window.audio;
}
