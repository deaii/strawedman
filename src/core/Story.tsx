import { Passage } from './Passage';
import LZString from 'lz-string';
import getPassagesFromElement from './Story/getPassagesFromElement';
import getScriptsFromElement from './Story/getScriptsFromElement';
import getStylesFromElement from './Story/getStylesFromElement';
import { CompressedStoryData } from './CompressedStoryData';

export class Story {
  /** 
  * @property {number} startPassage - The ID of the first passage to be displayed.
  * @type {number}
  * @readonly
  **/
  startPassage: number;

  /**
   * @property {string} name - The name of the story.
   * @type {string}
   * @readonly
   **/
  name: string;

  /**
   * @property {string} creator - The program that created this story.
   * @type {string}
   * @readonly
   **/
  creator: string;

  /**
   * @property {string} creatorVersion - The version of the program used to create this story.
   * @type {string}
   * @readonly
   **/
  creatorVersion: string;

  /**
   * If set to true, then any JavaScript errors are ignored -- normally, play
   * would end with a message shown to the user.
   *
   * @property {boolean} ignoreErrors - If errors should be ignored
   * @type {boolean}
   **/
  ignoreErrors: boolean = false;

  /**
   * The message shown to users when there is an error and ignoreErrors is not
   * true.
   *
   * @property {string} errorMessage - Error message
   * @type {string}
   **/
  errorMessage: string = '';

  /**
   * An array of all passages, indexed by ID.
   *
   * @property {Array} passages - Passages array
   * @type {Array}
   **/
  passages: {[id: number]: Passage} = {}

  /**
   * An array of user-specific scripts to run when the story is begun.
   *
   * @property {Array} userScripts - Array of user-added JavaScript
   * @type {Array}
   **/
  readonly userScripts: string[] = [];
  
  /**
   * An array of user-specific style declarations to add when the story is
   * begun.
   *
   * @property {Array} userStyles - Array of user-added styles
   * @type {Array}
   **/
  readonly userStyles: string[] = [];

  /**
   * 
   * @param data 
   * @param initState 
   * @param initData 
   * @param initOptions 
   */
  constructor (
    data: HTMLElement | string
  ) {
    if (typeof data === 'object') {
      this.name = data.getAttribute('name') || 'Default';
      this.startPassage = parseInt(data.getAttribute('startnode')!);
      this.creator = data.getAttribute('creator')!;
      this.creatorVersion = data.getAttribute('creator-version')!;
      this.addPassagesFromElement(data, 0);
    } else {
      let obj = JSON.parse(LZString.decompressFromUTF16(data)) as CompressedStoryData;
      this.name = obj.name;
      this.startPassage = obj.startPassage;
      this.creator = obj.creator;
      this.creatorVersion = obj.creatorVersion;
      this.passages = { ...this.passages, ...obj.passages }; 
    }
  }

  addPassagesFromCompressedString(data: string, offset: number) {
      let obj = JSON.parse(LZString.decompressFromUTF16(data)) as CompressedStoryData;

      Object.keys(obj.passages).forEach((x: string) => {
        const xNum = (parseInt(x));
        (this.passages[xNum + offset] = obj.passages[xNum]);
      });
  }

  addPassagesFromElement(dataEl: HTMLElement, offset: number = 0){
    this.passages = {...this.passages, ...getPassagesFromElement(dataEl, offset)};
    this.userScripts.push(...getScriptsFromElement(dataEl));
    this.userStyles.push(...getStylesFromElement(dataEl));
  }

  /**
   * Returns the Passage object corresponding to either an ID or name.
   * If none exists, then it returns null.
   *
   * @function passage
   * @param {string|number} idOrName - ID or name of the passage
   * @returns {object} - Passage object or null
   **/
  getPassage (idOrName: string | number): Passage | null {
    if (typeof idOrName === "number") {
      return this.passages[idOrName] || null;
    }else{
      return Object.values(this.passages).find((v, i, r) => (v.name === idOrName)) || null;
    }
  }
}
