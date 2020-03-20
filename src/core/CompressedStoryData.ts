import { Passage } from './Passage';
export interface CompressedStoryData {
  name: string;
  startPassage: number;
  creator: string;
  creatorVersion: string;
  passages: {
    [id: number]: Passage;
  };
}
