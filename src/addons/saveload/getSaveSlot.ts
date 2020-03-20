
export const GAME_SAVE_PREFIX = 'game_save_';
export const GAME_SAVE_PREFIX_LEN = GAME_SAVE_PREFIX.length;

export default function getSaveSlot(slotName: string): string {
  return `${GAME_SAVE_PREFIX}${slotName}`;
}