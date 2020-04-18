import React from 'react';
import ReactDOM from 'react-dom';
import AudioPlayerClip from './AudioPlayerClip';
import AudioPlayerFC from './AudioPlayerFC';

declare global {
  interface Window {
    audio: AudioPlayer;
  }
}

export default class AudioPlayer {
  #clips: AudioPlayerClip[] = [];

  #urlTransformer?: (url: string) => string;

  #elm: HTMLElement;

  public constructor(elm: HTMLElement, urlTransformer?: (url: string) => string) {
    this.#elm = elm;
    this.#urlTransformer = urlTransformer;
  }

  public play(src: string, loop?: boolean, persistOnClear?: boolean) {
    let finalSrc = src;
    if (this.#urlTransformer) {
      finalSrc = this.#urlTransformer(finalSrc);
    }

    if (!this.#clips.some(((x) => x.src === finalSrc))) {
      this.#clips.push({ src: finalSrc, loop, persistOnClear });
    }

    this.render();
  }

  public stop(stopPersistant?: boolean) {
    if (stopPersistant) {
      this.#clips = [];
    } else {
      this.#clips = this.#clips.filter((clip) => clip.persistOnClear);
    }
    this.render();
  }

  render() {
    ReactDOM.render(<AudioPlayerFC clips={this.#clips} />, this.#elm);
  }
}
