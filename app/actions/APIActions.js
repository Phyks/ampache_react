import humps from "humps";

import { CALL_API } from "../middleware/api";
import { DEFAULT_LIMIT } from "../reducers/paginate";

export default function (action, requestType, successType, failureType) {
    const itemName = action.rstrip("s");
    const fetchItemsSuccess = function (itemsList, itemsCount) {
        return {
            type: successType,
            payload: {
                items: itemsList,
                total: itemsCount
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
    const fetchItems = function (endpoint, username, passphrase, filter, offset, include = [], limit=DEFAULT_LIMIT) {
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
                        dispatch(fetchItemsSuccess(jsonData[itemName], jsonData[action]));
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
            const offset = (pageNumber - 1) * DEFAULT_LIMIT;
            dispatch(fetchItems(auth.endpoint, auth.username, auth.token.token, filter, offset, include));
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
