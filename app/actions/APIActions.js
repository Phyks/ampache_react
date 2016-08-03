import humps from "humps";

import { CALL_API } from "../middleware/api";

export const DEFAULT_LIMIT = 30;  /** Default max number of elements to retrieve. */

export default function (action, requestType, successType, failureType) {
    const itemName = action.rstrip("s");
    const fetchItemsSuccess = function (itemsList, itemsCount, pageNumber) {
        const nPages = Math.ceil(itemsCount / DEFAULT_LIMIT);
        return {
            type: successType,
            payload: {
                items: itemsList,
                nPages: nPages,
                currentPage: pageNumber
            }
        };
    };
    const fetchItemsRequest = function () {
        return {
            type: requestType,
            payload: {
            }
        };
    };
    const fetchItemsFailure = function (error) {
        return {
            type: failureType,
            payload: {
                error: error
            }
        };
    };
    const fetchItems = function (endpoint, username, passphrase, filter, pageNumber, include = [], limit=DEFAULT_LIMIT) {
        const offset = (pageNumber - 1) * DEFAULT_LIMIT;
        var extraParams = {
            offset: offset,
            limit: limit
        };
        if (filter) {
            extraParams.filter = filter;
        }
        if (include && include.length > 0) {
            extraParams.include = include;
        }
        return {
            type: CALL_API,
            payload: {
                endpoint: endpoint,
                dispatch: [
                    fetchItemsRequest,
                    jsonData => dispatch => {
                        dispatch(fetchItemsSuccess(jsonData[itemName], jsonData.totalCount, pageNumber));
                    },
                    fetchItemsFailure
                ],
                action: action,
                auth: passphrase,
                username: username,
                extraParams: extraParams
            }
        };
    };
    const loadItems = function({ pageNumber = 1, filter = null, include = [] } = {}) {
        return (dispatch, getState) => {
            const { auth } = getState();
            dispatch(fetchItems(auth.endpoint, auth.username, auth.token.token, filter, pageNumber, include));
        };
    };

    const camelizedAction = humps.pascalize(action);
    var returned = {};
    returned["fetch" + camelizedAction + "Success"] = fetchItemsSuccess;
    returned["fetch" + camelizedAction + "Request"] = fetchItemsRequest;
    returned["fetch" + camelizedAction + "Failure"] = fetchItemsFailure;
    returned["fetch" + camelizedAction] = fetchItems;
    returned["load" + camelizedAction] = loadItems;
    return returned;
}
