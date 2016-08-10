/**
 * This file defines entities storage models.
 */

// NPM imports
import Immutable from "immutable";

/** Record to store the shared entities. */
export const stateRecord = new Immutable.Record({
    isFetching: false,  /** Whether API fetching is in progress */
    error: null,  /** An error string */
    refCounts: new Immutable.Map({
        album: new Immutable.Map(),
        artist: new Immutable.Map(),
        song: new Immutable.Map(),
    }),  /** Map of id => reference count for each object type (garbage collection) */
    entities: new Immutable.Map({
        album: new Immutable.Map(),
        artist: new Immutable.Map(),
        song: new Immutable.Map(),
    }),  /** Map of id => entity for each object type */
});
