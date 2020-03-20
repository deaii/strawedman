import getSaveSlot from "./getSaveSlot";
import LZString from 'lz-string';

export default function getSave<S extends {}>(slot: string): null | S[] {
  const saveFile = localStorage.getItem(getSaveSlot(slot));

  if (saveFile) {
    return JSON.parse(LZString.decompressFromUTF16(saveFile));
  } else {
    return null;
  }
}