import React from 'react';

import SaveFunctions from './SaveFunctions';
import History from '../history/History';
import StoryData from '../../core/StoryData';
import YesNoModal from '../modals/YesNoModal';
import SaveFC from './SaveFC';
import HistoryFC from '../history/HistoryFC';
import SaveModal from './SaveModal';
import SaveDescriptor from './SaveDescriptor';
import EngineComponent from '../../core/EngineComponent';

const DEFAULT_SAVE_SLOT = 'AutoSave';

export default class SaveLoad extends History {
  useDefaultSaveSlot: boolean = true;

  #saveFunctions: SaveFunctions;

  public get storageId(): string {
    return this.#saveFunctions.storageId;
  }

  public set storageId(val: string) {
    this.#saveFunctions = new SaveFunctions(val);
  }

  public constructor(storageId?: string) {
    super();

    this.#saveFunctions = new SaveFunctions(storageId);

    window.addEventListener('beforeunload', () => {
      if (this.useDefaultSaveSlot) {
        this.save(DEFAULT_SAVE_SLOT);
      }
    });
  }

  tryLoad(slot: string): boolean {
    const loaded = this.#saveFunctions.getSave(slot);
    if (loaded && loaded.length > 0) {
      this.history = loaded;
      this.fastForward();
      return true;
    }

    return false;
  }

  save(slot: string) {
    this.#saveFunctions.storeSave(slot, this.history.slice(0, this.index));
  }

  saveExists(slot: string): boolean {
    return this.#saveFunctions.saveSlots.findIndex((x) => x.name === slot) >= 0;
  }

  getComponent(): EngineComponent {
    const self = this;
    const fc = React.memo(({ nonce }: StoryData) => {
      const [slots, setSlots] = React.useState<SaveDescriptor[]>(
        self.#saveFunctions.saveSlots,
      );
      const [restartModel, setRestartModel] = React.useState<boolean>(false);
      const [saveModal, setSaveModel] = React.useState<boolean>(false);

      const { index } = self;
      const { length } = self;

      const goBack = index > 0;
      const goForward = index + 1 < length;
      const goBackClick = () => self.back(nonce);
      const goForwardClick = () => self.forward();

      return (
        <>
          <HistoryFC
            className={`${self.className || 'sm-history'} history`}
            goBackClick={goBackClick}
            goForwardClick={goForwardClick}
            goBack={goBack}
            goForward={goForward}
          />
          <SaveFC
            className={`${self.className || 'sm-history'} saveload`}
            onRestart={() => {
              setRestartModel(true);
              window.setBlur(true);
            }}
            onSaves={() => {
              setSaveModel(true);
              window.setBlur(true);
            }}
          />
          {restartModel && (
            <YesNoModal
              title="Restart?"
              text="Do you want to restart"
              onResult={(value) => {
                setRestartModel(false);
                window.setBlur(false);
                if (value) {
                  window.engine.start();
                }
              }}
            />
          )}
          {saveModal && (
            <SaveModal
              slots={slots}
              onDelete={(slot) => {
                self.#saveFunctions.deleteSlot(slot);
                setSlots(self.#saveFunctions.saveSlots);
              }}
              onCancel={() => {
                setSaveModel(false);
                window.setBlur(false);
              }}
              onLoad={(slot) => {
                setSaveModel(false);
                window.setBlur(false);
                self.tryLoad(slot);
              }}
              onSave={(slot) => {
                self.save(slot);
                setSlots(self.#saveFunctions.saveSlots);
              }}
              checkSave={(slot) => self.saveExists(slot)}
            />
          )}
        </>
      );
    });

    return {
      FC: fc,
      name: 'SaveLoad',
    };
  }
}
