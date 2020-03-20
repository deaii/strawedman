import { GAME_SAVE_PREFIX, GAME_SAVE_PREFIX_LEN } from "./getSaveSlot";

export default function getSaveSlots(): string[] {
  const rVal: string[] = [];

  for (let i = 0; i < localStorage.length; i++){
    const key = localStorage.key(i);

    if (key && key.startsWith(GAME_SAVE_PREFIX)){
      rVal.push(key.substr(GAME_SAVE_PREFIX_LEN));
    }
  }

  return rVal;
}
