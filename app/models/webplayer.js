/**
 * This file defines authentication related models.
 */

// NPM imports
import Immutable from "immutable";


/** Record to store the webplayer state. */
export const stateRecord = new Immutable.Record({
    isPlaying: false,  /** Whether webplayer is playing */
    isRandom: false,  /** Whether random mode is on */
    isRepeat: false,  /** Whether repeat mode is on */
    isMute: false,  /** Whether sound is muted or not */
    volume: 100,  /** Current volume, between 0 and 100 */
    currentIndex: 0,  /** Current index in the playlist */
    playlist: new Immutable.List(),  /** List of songs IDs, references songs in the entities store */
    error: null,  /** An error string */
});
