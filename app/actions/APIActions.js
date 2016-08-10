/**
 * This file implements actions to fetch and load data from the API.
 */

// NPM imports
import { normalize, arrayOf } from "normalizr";
import humps from "humps";

// Other actions
import { CALL_API } from "../middleware/api";
import { pushEntities } from "./entities";

// Models
import { artist, song, album } from "../models/api";

// Constants
export const DEFAULT_LIMIT = 32;  /** Default max number of elements to retrieve. */


/**
 * This function wraps around an API action to generate actions trigger
 * functions to load items etc.
 *
 * @param   action          API action.
 * @param   requestType     Action type to trigger on request.
 * @param   successType     Action type to trigger on success.
 * @param   failureType     Action type to trigger on failure.
 */
export default function (action, requestType, successType, failureType) {
    /** Get the name of the item associated with action */
    const itemName = action.rstrip("s");

    /**
     * Normalizr helper to normalize API response.
     *
     * @param   jsonData    The JS object returned by the API.
     * @return  A normalized object.
     */
    const _normalizeAPIResponse = function (jsonData) {
        return normalize(
            jsonData,
            {
                artist: arrayOf(artist),
                album: arrayOf(album),
                song: arrayOf(song),
            },
            {
                // Use custom assignEntity function to delete useless fields
                assignEntity: function (output, key, value) {
                    if (key == "sessionExpire") {
                        delete output.sessionExpire;
                    } else {
                        output[key] = value;
                    }
                },
            }
        );
    };

    /**
     * Callback on successful fetch of paginated items
     *
     * @param   jsonData    JS object returned from the API.
     * @param   pageNumber  Number of the page that was fetched.
     */
    const fetchPaginatedItemsSuccess = function (jsonData, pageNumber, limit) {
        jsonData = _normalizeAPIResponse(jsonData);

        // Compute the total number of pages
        const nPages = Math.ceil(jsonData.result[itemName].length / limit);

        // Return success actions
        return [
            // Action for the global entities store
            pushEntities(jsonData.entities, [itemName]),
            // Action for the paginated store
            {
                type: successType,
                payload: {
                    type: itemName,
                    result: jsonData.result[itemName],
                    nPages: nPages,
                    currentPage: pageNumber,
                },
            },
        ];
    };

    /**
     * Callback on successful fetch of single item
     *
     * @param   jsonData    JS object returned from the API.
     * @param   pageNumber  Number of the page that was fetched.
     */
    const fetchItemSuccess = function (jsonData) {
        jsonData = _normalizeAPIResponse(jsonData);

        return pushEntities(jsonData.entities, [itemName]);
    };

    /** Callback on request */
    const fetchItemsRequest = function () {
        // Return a request type action
        return {
            type: requestType,
            payload: {
            },
        };
    };

    /**
     * Callback on failed fetch
     *
     * @param   error   An error object, either a string or an i18nError
     *                  object.
     */
    const fetchItemsFailure = function (error) {
        // Return a failure type action
        return {
            type: failureType,
            payload: {
                error: error,
            },
        };
    };

    /**
     * Method to trigger a fetch of items.
     *
     * @param   endpoint    Ampache server base URL.
     * @param   username    Username to use for API request.
     * @param   filter      An eventual filter to apply (mapped to API filter
     *                      param)
     * @param   pageNumber  Number of the page to fetch items from.
     * @param   limit       Max number of items to fetch.
     * @param   include     [Optional] A list of includes to return as well
     *                      (mapped to API include param)
     *
     * @return  A CALL_API action to fetch the specified items.
     */
    const fetchItems = function (endpoint, username, passphrase, filter, pageNumber, limit, include = []) {
        // Compute offset in number of items from the page number
        const offset = (pageNumber - 1) * DEFAULT_LIMIT;
        // Set extra params for pagination
        let extraParams = {
            offset: offset,
            limit: limit,
        };

        // Handle filter
        if (filter) {
            extraParams.filter = filter;
        }

        // Handle includes
        if (include && include.length > 0) {
            extraParams.include = include;
        }

        // Return a CALL_API action
        return {
            type: CALL_API,
            payload: {
                endpoint: endpoint,
                dispatch: [
                    fetchItemsRequest,
                    null,
                    fetchItemsFailure,
                ],
                action: action,
                auth: passphrase,
                username: username,
                extraParams: extraParams,
            },
        };
    };

    /**
     * High level method to load paginated items from the API wihtout dealing about credentials.
     *
     * @param   pageNumber  [Optional] Number of the page to fetch items from.
     * @param   filter      [Optional] An eventual filter to apply (mapped to
     *                      API filter param)
     * @param   include     [Optional] A list of includes to return as well
     *                      (mapped to API include param)
     *
     * Dispatches the CALL_API action to fetch these items.
     */
    const loadPaginatedItems = function ({ pageNumber = 1, limit = DEFAULT_LIMIT, filter = null, include = [] } = {}) {
        return (dispatch, getState) => {
            // Get credentials from the state
            const { auth } = getState();
            // Get the fetch action to dispatch
            const fetchAction = fetchItems(
                auth.endpoint,
                auth.username,
                auth.token.token,
                filter,
                pageNumber,
                limit,
                include
            );
            // Set success callback
            fetchAction.payload.dispatch[1] = (
                jsonData => dispatch => {
                    // Dispatch all the necessary actions
                    const actions = fetchPaginatedItemsSuccess(jsonData, pageNumber, limit);
                    actions.map(action => dispatch(action));
                }
            );
            // Dispatch action
            dispatch(fetchAction);
        };
    };

    /**
     * High level method to load a single item from the API wihtout dealing about credentials.
     *
     * @param   filter      The filter to apply (mapped to API filter param)
     * @param   include     [Optional] A list of includes to return as well
     *                      (mapped to API include param)
     *
     * Dispatches the CALL_API action to fetch this item.
     */
    const loadItem = function ({ filter = null, include = [] } = {}) {
        return (dispatch, getState) => {
            // Get credentials from the state
            const { auth } = getState();
            // Get the action to dispatch
            const fetchAction = fetchItems(
                auth.endpoint,
                auth.username,
                auth.token.token,
                filter,
                1,
                DEFAULT_LIMIT,
                include
            );
            // Set success callback
            fetchAction.payload.dispatch[1] = (
                jsonData => dispatch => {
                    dispatch(fetchItemSuccess(jsonData));
                }
            );
            // Dispatch action
            dispatch(fetchAction);
        };
    };

    // Remap the above methods to methods including item name
    var returned = {};
    const camelizedAction = humps.pascalize(action);
    returned["loadPaginated" + camelizedAction] = loadPaginatedItems;
    returned["load" + camelizedAction.rstrip("s")] = loadItem;
    return returned;
}
