import LZString from 'lz-string';
import SaveDescriptor from './SaveDescriptor';
import SaveData from './SaveData';
import HistoryPage from '../history/HistoryPage';

const getSavePrefix = (storageId: string) => `game_save_${storageId}_`;

export default class SaveFunctions {
  #saveSlots: null | SaveDescriptor[] = null;

  #storageId: string;

  readonly #savePrefix: string;

  #sorted: boolean;

  constructor(storageId?: string) {
    this.#storageId = storageId || 'default';
    this.#savePrefix = getSavePrefix(this.#storageId);
    this.#sorted = false;
  }

  get storageId() {
    return this.#storageId;
  }

  addSaveSlots(...newSlots: SaveDescriptor[]) {
    this.saveSlots.unshift(...newSlots);
  }

  getSave(slot: string): null | HistoryPage[] {
    const storageName = this.getSaveSlotKey(slot);
    const saveData = SaveFunctions.getSaveData(storageName);
    return saveData ? saveData.data : null;
  }

  static getSaveData(storageName: string): null | SaveData {
    const saveFile = localStorage.getItem(storageName);

    if (saveFile) {
      const str = LZString.decompressFromUTF16(saveFile);
      const data: SaveData = JSON.parse(str);
      return data;
    }
    return null;
  }

  getSaveSlotKey(slotName: string): string {
    return `${this.#savePrefix}${slotName}`;
  }

  reload() {
    const slots: SaveDescriptor[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);

      if (key && key.startsWith(this.#savePrefix)) {
        const fullSave = SaveFunctions.getSaveData(key);
        if (fullSave) {
          slots.push({ timestamp: fullSave.timestamp, name: fullSave.name });
        }
      }
    }

    this.#saveSlots = slots;
    this.#sorted = false;
  }

  get saveSlots(): SaveDescriptor[] {
    if (!this.#saveSlots) {
      this.reload();
    }

    if (!this.#sorted) {
      this.#sorted = true;
      this.#saveSlots = this.#saveSlots!.sort((a, b) => a.timestamp - b.timestamp);
    }

    return this.#saveSlots!;
  }

  set saveSlots(val: SaveDescriptor[]) {
    this.#saveSlots = val;
    this.#sorted = false;
  }

  deleteSlot(slotName: string) {
    const storageName = this.getSaveSlotKey(slotName);
    localStorage.removeItem(storageName);
    this.#saveSlots = this.#saveSlots!.filter((x) => x.name !== slotName);
  }

  storeSave(saveSlot: string, data: HistoryPage[]) {
    const timestamp = new Date().valueOf();

    const payload: SaveData = {
      data,
      name: saveSlot,
      timestamp,
    };

    const dataStr = LZString.compressToUTF16(JSON.stringify(payload));
    const key = this.getSaveSlotKey(saveSlot);
    localStorage.setItem(key, dataStr);

    this.saveSlots.unshift({ timestamp, name: saveSlot });
  }
}
