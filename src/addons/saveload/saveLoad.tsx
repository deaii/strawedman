import React from 'react';

import { History, HistoryFC } from '../history/History';
import { HistoryPage } from '../history/HistoryPage';
import storeSave from './storeSave';
import getSave from './getSave';
import getSaveSlots from './getSaveSlots';
import { StoryData } from '../../core/StoryData';

// eslint-disable-next-line import/no-webpack-loader-syntax
import save from '!!raw-loader!@fortawesome/fontawesome-free/svgs/solid/save.svg';

// eslint-disable-next-line import/no-webpack-loader-syntax
import redo from '!!raw-loader!@fortawesome/fontawesome-free/svgs/solid/redo.svg';

import { YesNoModal } from '../modals/YesNoModal';

const DEFAULT_SAVE_SLOT = '⚿';

export const SAVE_ACTION = 'history-save';
export const LOAD_ACTION = 'history-load';
export const AUTOLOAD_ACTION = 'history-autoload';
export const AUTOSAVE_ACTION = 'history-autosave';

export class SaveLoad<S extends {} = {}> extends History<S> {
  useDefaultSaveSlot: boolean = true;

  public constructor() {
    super();

    // Save games in progress when quitting.
    window.addEventListener("beforeunload", () => {
      if (this.useDefaultSaveSlot) {
        storeSave(DEFAULT_SAVE_SLOT, this.history);
      }
    });
  }

  tryLoad(slot: string) {
    var loaded = getSave<HistoryPage<S>>(slot);
    if (loaded && (loaded.length > 0)) {
      this.history = loaded;
      this.show(this.getCurrentPage()!);
    } else {
      return null;
    }
  }

  async trySaveAsync(slot: string, promptOnOverwrite?: null | ((slot: string) => Promise<boolean>)): Promise<boolean> {
    if (promptOnOverwrite) {
      if (getSaveSlots().indexOf(slot) >= 0) {
        const proceed = await promptOnOverwrite(slot);
        if (!proceed) {
          return false;
        }
      }
    }

    storeSave(slot, this.history);
    return true;
  }

  reset() {
    window.engine.start();
  }

  getComponent(): React.FC<StoryData<S>> {
    var self = this;
    return React.memo(({nonce}) => {
      const [restartModel, setRestartModel] = React.useState<boolean>(false);
      const [, setSaveModel] = React.useState<boolean>(false);

      const index = self.index;
      const length = self.length;

      const goBack = (index > 0);
      const goForward = (index + 1) < length;
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
            onRestart={() => setRestartModel(true)}
            onSaves={() => setSaveModel(true)}
          />
          {restartModel && (
            <YesNoModal 
              title={"Restart?"}
              text="Do you want to restart"
              onResult={(value) => {
                setRestartModel(false);
                if (value) {
                  self.reset();
                }
              }} 
            />
          )}
        </>
        );
    });
  }
}

interface SaveFCProps {
  className: string;
  onSaves: () => void;
  onRestart: () => void;
}

export const SaveFC: React.FC<SaveFCProps> = ({
  className,
  onSaves,
  onRestart
}) => {
  return (
    <div className={className}>
      <button 
        className="btn"
        type="button"
        onClick={onSaves}
      >
        <span className="btn-icon" dangerouslySetInnerHTML={{__html: save}} />
        <span className="btn-text">Saves</span>
      </button>
      <br />
      <button 
        className="btn"
        type="button"
        onClick={onRestart}
      >
        <span className="btn-icon" dangerouslySetInnerHTML={{__html: redo}} />
        <span className="btn-text">Restart</span>
      </button>
    </div>
  )
};