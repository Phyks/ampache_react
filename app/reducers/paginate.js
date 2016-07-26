import { createReducer } from "../utils";

export const DEFAULT_LIMIT = 1;  /** Default max number of elements to retrieve. */

const initialState = {
    isFetching: false,
    items: [],
    total: 0,
    error: ""
};

// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
export default function paginate(types) {
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error("Expected types to be an array of three elements.");
    }
    if (!types.every(t => typeof t === "string")) {
        throw new Error("Expected types to be strings.");
    }

    const [ requestType, successType, failureType ] = types;

    return createReducer(initialState, {
        [requestType]: (state) => {
            return Object.assign({}, state, {
                isFetching: true,
                error: "",
            });
        },
        [successType]: (state, payload) => {
            return Object.assign({}, state, {
                isFetching: false,
                items: payload.items,
                total: payload.total,
                error: ""
            });
        },
        [failureType]: (state, payload) => {
            return Object.assign({}, state, {
                isFetching: false,
                error: payload.error
            });
        }
    });
}
