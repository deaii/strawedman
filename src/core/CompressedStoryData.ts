import Passage from './Passage';

export default interface CompressedStoryData {
  name: string;
  startPassage: number;
  creator: string;
  creatorVersion: string;
  passages: {
    [id: number]: Passage;
  };
  scripts: string[];
  styles: string[];
}
