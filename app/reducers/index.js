/**
 *
 */

// NPM imports
import { routerReducer as routing } from "react-router-redux";
import { combineReducers } from "redux";

// Import all the available reducers
import auth from "./auth";
import entities from "./entities";
import paginatedMaker from "./paginated";
import webplayer from "./webplayer";

// Actions
import * as ActionTypes from "../actions";

// Build paginated reducer
const paginated = paginatedMaker([
    ActionTypes.API_REQUEST,
    ActionTypes.API_SUCCESS,
    ActionTypes.API_FAILURE,
]);

// Export the combined reducers
export default combineReducers({
    routing,
    auth,
    entities,
    paginated,
    webplayer,
});
