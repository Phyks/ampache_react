/**
 * These actions are actions acting directly on all the available stores.
 */


/** Define an action to invalidate all the stores, e.g. in case of logout. */
export const INVALIDATE_STORE = "INVALIDATE_STORE";
export function invalidateStore() {
    return {
        type: INVALIDATE_STORE,
    };
}
