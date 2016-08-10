/**
 * This implements the global entities reducer.
 */

// NPM imports
import Immutable from "immutable";

// Local imports
import { createReducer } from "../utils";

// Models
import { stateRecord } from "../models/entities";

// Actions
import {
    API_REQUEST,
    API_FAILURE,
    PUSH_ENTITIES,
    INCREMENT_REFCOUNT,
    DECREMENT_REFCOUNT,
    INVALIDATE_STORE
} from "../actions";


/**
 * Helper methods
 */

/**
 * Update the reference counter for a given item.
 *
 * Do not do any garbage collection.
 *
 * @param   state       The state object to update.
 * @param   keyPath     The keyPath to update, from the refCount key.
 * @param   incr        The increment (or decrement) for the reference counter.
 *
 * @return  An updated state.
 */
function updateRefCount(state, keyPath, incr) {
    // Prepend refCounts to keyPath
    const refCountKeyPath = Array.concat(["refCounts"], keyPath);
    // Get updated value
    let newRefCount = state.getIn(refCountKeyPath) + incr;
    if (isNaN(newRefCount)) {
        // If NaN, reference does not exist, so set it to ±1
        newRefCount = Math.sign(incr);
    }
    // Update state
    return state.setIn(refCountKeyPath, newRefCount);
}


/**
 * Update the reference counter of a given entity, taking into account the
 * nested objects.
 *
 * Do not do any garbage collection.
 *
 * @param   state       The state object to update.
 * @param   itemName    The type of the entity object.
 * @param   id          The id of the entity.
 * @param   entity      The entity object, as Immutable.
 * @param   incr        The increment (or decrement) for the reference counter.
 *
 * @return  An updated state.
 */
function updateEntityRefCount(state, itemName, id, entity, incr) {
    let newState = state;
    let albums = null;
    let tracks = null;
    switch (itemName) {
        case "artist":
            // Update artist refCount
            newState = updateRefCount(newState, ["artist", id], incr);
            // Update nested albums refCount
            albums = entity.get("albums");
            if (Immutable.List.isList(albums)) {
                albums.forEach(function (id) {
                    newState = updateRefCount(newState, ["album", id], incr);
                });
            }
            // Update nested tracks refCount
            tracks = entity.get("songs");
            if (Immutable.List.isList(tracks)) {
                tracks.forEach(function (id) {
                    newState = updateRefCount(newState, ["song", id], incr);
                });
            }
            break;
        case "album":
            // Update album refCount
            newState = updateRefCount(newState, ["album", id], incr);
            // Update nested artist refCount
            newState = updateRefCount(newState, ["artist", entity.get("artist")], incr);
            // Update nested tracks refCount
            tracks = entity.get("tracks");
            if (Immutable.List.isList(tracks)) {
                tracks.forEach(function (id) {
                    newState = updateRefCount(newState, ["song", id], incr);
                });
            }
            break;
        case "song":
            // Update track refCount
            newState = updateRefCount(newState, ["song", id], incr);
            // Update nested artist refCount
            newState = updateRefCount(newState, ["artist", entity.get("artist")], incr);
            // Update nested album refCount
            newState = updateRefCount(newState, ["album", entity.get("album")], incr);
            break;
        default:
            // Just update the entity, no nested entities
            newState = updateRefCount(newState, [itemName, id], incr);
            break;
    }
    return newState;
}


/**
 *
 */
function garbageCollection(state) {
    let newState = state;
    state.refCounts.forEach(function (refCounts, itemName) {
        refCounts.forEach(function (refCount, id) {
            if (refCount < 1) {
                // Garbage collection
                newState = newState.deleteIn(["entities", itemName, id]);
                newState = newState.deleteIn(["refCounts", itemName, id]);
            }
        });
    });
    return newState;
}


/**
 * Initial state
 */
var initialState = new stateRecord();


/**
 * Reducer
 */
export default createReducer(initialState, {
    [API_REQUEST]: (state) => {
        return (
            state
            .set("isFetching", true)
            .set("error", null)
        );
    },
    [API_FAILURE]: (state, payload) => {
        return (
            state
            .set("isFetching", false)
            .set("error", payload.error)
        );
    },
    [PUSH_ENTITIES]: (state, payload) => {
        let newState = state;

        // Unset error and isFetching
        newState = state.set("isFetching", false).set("error", payload.error);

        // Merge entities
        newState = newState.mergeIn(["entities"], payload.entities);

        // Increment reference counter
        payload.refCountType.forEach(function (itemName) {
            newState.getIn(["entities", itemName]).forEach(function (entity, id) {
                newState = updateEntityRefCount(newState, itemName, id, entity, 1);
            });
        });

        return newState;
    },
    [INCREMENT_REFCOUNT]: (state, payload) => {
        let newState = state;

        // Increment reference counter
        for (let itemName in payload.entities) {
            newState.getIn(["entities", itemName]).forEach(function (entity, id) {
                newState = updateEntityRefCount(newState, itemName, id, entity, 1);
            });
        }

        return newState;
    },
    [DECREMENT_REFCOUNT]: (state, payload) => {
        let newState = state;

        // Decrement reference counter
        for (let itemName in payload.entities) {
            newState.getIn(["entities", itemName]).forEach(function (entity, id) {
                newState = updateEntityRefCount(newState, itemName, id, entity, -1);
            });
        }

        // Perform garbage collection
        newState = garbageCollection(newState);

        return newState;
    },
    [INVALIDATE_STORE]: () => {
        return new stateRecord();
    }
});
