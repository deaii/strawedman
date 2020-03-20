import LZString from 'lz-string';
import getSaveSlot from "./getSaveSlot";

export default function storeSave<S extends {}>(saveSlot: string, data: S[]){
  const dataStr = LZString.compressToUTF16(JSON.stringify(data));
  const key = getSaveSlot(saveSlot);

  localStorage.setItem(key, dataStr);
}