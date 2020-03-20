import { StoryError } from "./StoryError";
import { Story } from "./Story";
import Passage from "./Passage";
import { GameEventEmitter } from "./GameEventEmitter";

export interface PassageArgs {
  passage: Passage; 
  nonce: number; 
  state: any;
}

export interface Events {
    /**
     * Triggered when an error occurs during gameplay, including during rendering.
     */
    storyError: GameEventEmitter<StoryError>;

    /**
     * Triggered when the story is loaded, before either the first passage, or the
     * passage stored in the auto save slot, is loaded.
     */
    storyLoaded: GameEventEmitter<Story>;

    /**
     * Trigered when scanning passages for setup.  Useful for extracting configurations
     * or scripts from passages.
     */
    passageSetup: GameEventEmitter<Passage>;
    
    /**
     * Triggered when the story is finished loading, and right before
     * the first passage is displayed. The story property of this event
     * contains the story.
     */
    storyStarted: GameEventEmitter<Story>;
  
    /**
     * Triggered when a passage is hidden from view in preparation of a new
     * passage being rendered
     */
    passageHidden: GameEventEmitter<PassageArgs>;

    /**
     * Triggered before a passage is processed.  This is the best time to save,
     * clean up, or transform the session's state.
     */
    passageProcessing: GameEventEmitter<PassageArgs>;
  
    /**
     * Triggered just before a passage is processed and rendered
     */
    passageShowing: GameEventEmitter<PassageArgs>;
  
    /**
     * Triggered after a passage has fully rendered to the screen.
     */
    passageRendered: GameEventEmitter<HTMLDivElement>;
}

export const events: Events = {
  storyError: new GameEventEmitter<StoryError>(),
  storyLoaded: new GameEventEmitter<Story>(),
  passageSetup: new GameEventEmitter<Passage>(),
  storyStarted: new GameEventEmitter<Story>(),
  passageHidden: new GameEventEmitter<PassageArgs>(),
  passageProcessing: new GameEventEmitter<PassageArgs>(),
  passageShowing: new GameEventEmitter<PassageArgs>(),
  passageRendered: new GameEventEmitter<HTMLDivElement>(),
}

declare global {
  interface Window {
    events: Events;
  }
}
