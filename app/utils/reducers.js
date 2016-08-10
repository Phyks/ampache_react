/**
 * Collection of helper functions to deal with reducers.
 */


/**
 * Utility function to create a reducer.
 *
 * @param initialState  Initial state of the reducer.
 * @param reducerMap    Map between action types and reducing functions.
 *
 * @return A reducer.
 */
export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}
