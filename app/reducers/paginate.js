import Immutable from "immutable";

import { createReducer } from "../utils";
import { stateRecord } from "../models/paginate";
import { INVALIDATE_STORE } from "../actions";

const initialState = new stateRecord();

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
            return (
                state
                    .set("isFetching", true)
                    .set("error", null)
            );
        },
        [successType]: (state, payload) => {
            return (
                state
                    .set("isFetching", false)
                    .set("items", new Immutable.List(payload.items))
                    .set("error", null)
                    .set("nPages", payload.nPages)
                    .set("currentPage", payload.currentPage)
            );
        },
        [failureType]: (state, payload) => {
            return (
                state
                    .set("isFetching", false)
                    .set("error", payload.error)
            );
        },
        [INVALIDATE_STORE]: () => {
            return new stateRecord();
        }
    });
}
