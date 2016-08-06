import { routerReducer as routing } from "react-router-redux";
import { combineReducers } from "redux";

import auth from "./auth";
import paginate from "./paginate";
import webplayer from "./webplayer";

import * as ActionTypes from "../actions";

// Updates the pagination data for different actions.
const api = paginate([
    ActionTypes.API_REQUEST,
    ActionTypes.API_SUCCESS,
    ActionTypes.API_FAILURE
]);

const rootReducer = combineReducers({
    routing,
    auth,
    api,
    webplayer
});

export default rootReducer;
