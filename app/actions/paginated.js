/**
 * These actions are actions acting directly on the paginated views store.
 */

// Other actions
import { decrementRefCount } from "./entities";


/** Define an action to invalidate results in paginated store. */
export const CLEAR_PAGINATED_RESULTS = "CLEAR_PAGINATED_RESULTS";
export function clearPaginatedResults() {
    return (dispatch, getState) => {
        // Decrement reference counter
        const paginatedStore = getState().paginated;
        const entities = {};
        entities[paginatedStore.get("type")] = paginatedStore.get("result").toJS();
        dispatch(decrementRefCount(entities));

        // Clear results in store
        dispatch({
            type: CLEAR_PAGINATED_RESULTS,
        });
    };
}
