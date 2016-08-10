/**
 * This implements a wrapper to create reducers for paginated content.
 */

// NPM imports
import Immutable from "immutable";

// Local imports
import { createReducer } from "../utils";

// Models
import { stateRecord } from "../models/paginated";

// Actions
import { CLEAR_PAGINATED_RESULTS, INVALIDATE_STORE } from "../actions";


/** Initial state of the reducer */
const initialState = new stateRecord();


/**
 * Creates a reducer managing pagination, given the action types to handle.
 */
export default function paginated(types) {
    // Check parameters
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error("Expected types to be an array of three elements.");
    }
    if (!types.every(t => typeof t === "string")) {
        throw new Error("Expected types to be strings.");
    }

    const [ requestType, successType, failureType ] = types;

    // Create reducer
    return createReducer(initialState, {
        [requestType]: (state) => {
            return state;
        },
        [successType]: (state, payload) => {
            return (
                state
                    .set("type", payload.type)
                    .set("result", Immutable.fromJS(payload.result))
                    .set("nPages", payload.nPages)
                    .set("currentPage", payload.currentPage)
            );
        },
        [failureType]: (state) => {
            return state;
        },
        [CLEAR_PAGINATED_RESULTS]: (state) => {
            return state.set("result", new Immutable.List());
        },
        [INVALIDATE_STORE]: () => {
            // Reset state on invalidation
            return new stateRecord();
        },
    });
}
