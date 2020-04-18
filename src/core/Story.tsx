import LZString from 'lz-string';
import { isNullOrUndefined } from 'util';
import Passage from './Passage';
import getPassagesFromElement from './Story/getPassagesFromElement';
import getScriptsFromElement from './Story/getScriptsFromElement';
import getStylesFromElement from './Story/getStylesFromElement';
import CompressedStoryData from './CompressedStoryData';
import StoryLoadOptions from './StoryLoadOptions';

export default class Story {
  /**
  * @property {string} startPassage - The name of the first passage to be displayed.
  * @type {string}
  * @readonly
  * */
  startPassage: string = '';

  /**
   * @property {string} name - The name of the story.
   * @type {string}
   * @readonly
   * */
  name: string = '';

  /**
   * @property {string} creator - The program that created this story.
   * @type {string}
   * @readonly
   * */
  creator: string = '';

  /**
   * @property {string} creatorVersion - The version of the program used to create this story.
   * @type {string}
   * @readonly
   * */
  creatorVersion: string = '';

  /**
   * If set to true, then any JavaScript errors are ignored -- normally, play
   * would end with a message shown to the user.
   *
   * @property {boolean} ignoreErrors - If errors should be ignored
   * @type {boolean}
   * */
  ignoreErrors: boolean = false;

  /**
   * The message shown to users when there is an error and ignoreErrors is not
   * true.
   *
   * @property {string} errorMessage - Error message
   * @type {string}
   * */
  errorMessage: string = '';

  /**
   * An array of all passages, indexed by passage name.
   *
   * @property {Array} passages - Passages array
   * @type {Array}
   * */
  passages: { [name: string]: Passage } = {};

  /**
   * An array of user-specific scripts to run when the story is begun.
   *
   * @property {Array} userScripts - Array of user-added JavaScript
   * @type {Array}
   * */
  readonly userScripts: string[] = [];

  /**
   * An array of user-specific style declarations to add when the story is
   * begun.
   *
   * @property {Array} userStyles - Array of user-added styles
   * @type {Array}
   * */
  readonly userStyles: string[] = [];

  #finishedLoading: boolean = false;

  /**
   * Are all resources and stories ready?
   */
  get finishedLoading() {
    return this.#finishedLoading;
  }

  #sortedPassages?: Passage[];

  #loadPromises: Promise<void>[] = [];

  get sortedPassages(): Passage[] {
    if (!this.#sortedPassages) {
      if (!this.#finishedLoading) {
        throw new Error("Don't call Story.sortedPassages before calling Story.finishedLoading!");
      } else {
        this.#sortedPassages = Object.values(this.passages)
          .sort((a, b) => (a.id - b.id));
      }
    }

    return this.#sortedPassages;
  }

  /**
   *
   * @param data
   * @param initState
   * @param initData
   * @param initOptions
   */
  constructor(
    data: HTMLCollectionOf<HTMLElement> | string,
  ) {
    if (typeof data === 'object') {
      this.addPassagesFromElementCollection(
        data,
        { loadStyles: true, loadScripts: true, getStoryData: true },
      );
    } else {
      this.addPassagesFromCompressedString(
        data,
        { loadStyles: true, loadScripts: true, getStoryData: true },
      );
    }
  }

  addPassagesFromCompressedString(data: string, { offset: os }: StoryLoadOptions): number {
    const offset = isNullOrUndefined(os) ? this.getMinOffset() : os;

    const obj = JSON.parse(LZString.decompressFromUTF16(data)) as CompressedStoryData;

    let rVal = -Number.MAX_SAFE_INTEGER;

    Object.keys(obj.passages).forEach((x: string) => {
      const intX = (parseInt(x, 10)) + offset!;
      (this.passages[intX] = obj.passages[intX]);
      rVal = intX > rVal ? intX : rVal;
    });

    return rVal;
  }

  addPassagesFromElement(
    dataEl: HTMLElement,
    options: StoryLoadOptions = {},
  ): number {
    const { loadScripts, loadStyles, offset: os } = options;
    const offset = isNullOrUndefined(os) ? this.getMinOffset() : os;

    const newPassages = getPassagesFromElement(dataEl, offset);

    let rVal = -Number.MAX_SAFE_INTEGER;

    Object.keys(newPassages).forEach((x) => {
      const intX = parseInt(x, 10);
      rVal = (intX > rVal ? intX : rVal);
    });

    this.mergePassages(getPassagesFromElement(dataEl, offset));

    if (loadScripts) {
      this.userScripts.push(...getScriptsFromElement(dataEl));
    }

    if (loadStyles) {
      this.userStyles.push(...getStylesFromElement(dataEl));
    }

    return rVal;
  }

  addPassagesFromElementCollection(
    collection: HTMLCollectionOf<HTMLElement>,
    options: StoryLoadOptions,
  ) {
    if (collection.length > 0) {
      for (let i = 0; i < collection.length; i += 1) {
        const elm = collection.item(i);
        if (elm) {
          this.addPassagesFromElement(elm, options);
        }
      }
      if (options.getStoryData) {
        const elm = collection.item(0)!;
        const startId = parseInt(elm.getAttribute('startnode')!, 10);

        this.name = elm.getAttribute('name') || 'Default';

        this.startPassage = Object.values(this.passages).filter((p) => p.id === startId)[0].name;
        this.creator = elm.getAttribute('creator')!;
        this.creatorVersion = elm.getAttribute('creator-version')!;
      }
    }
  }

  private mergePassages(psgs: { [name: string]: Passage }) {
    Object.keys(psgs).forEach((name) => {
      const psg = psgs[name];
      const curPsg = this.passages[name];

      if (curPsg) {
        // If an existing passage has the same name, pick the passage with more
        // text.
        if (!curPsg.source || curPsg.source.length < psg.source.length) {
          this.passages[name] = psg;
        }
      } else {
        // An existing passage doesn't exist with the same name.  Keep the new
        // passage.
        this.passages[name] = psg;
      }
    });
  }

  loadExternal(url: string, options: StoryLoadOptions) {
    this.#loadPromises.push(new Promise<void>((res, rej) => {
      fetch(url)
        .then((response) => response.text())
        .then((text) => {
          const document = new DOMParser().parseFromString(text, 'text/html');
          const dataElms = document.getElementsByTagName('tw-storydata') as HTMLCollectionOf<HTMLElement>;
          this.addPassagesFromElementCollection(dataElms, options);
          res();
        }).catch((e) => {
          rej(e);
        });
    }));
  }

  async finishLoading() {
    if (this.#finishedLoading) {
      throw new Error('Story.finishedLoading called more than once.');
    } else {
      this.#finishedLoading = true;
      window.events.storyLoaded.trigger(this);
    }
  }

  getPassage(name: string): Passage | null {
    return this.passages[name] || null;
  }

  private getMinOffset() {
    let rVal = 0;

    Object.values(this.passages).forEach((value) => {
      const { id } = value;
      if (id >= rVal) {
        rVal = id + 1;
      }
    });

    return rVal;
  }
}
