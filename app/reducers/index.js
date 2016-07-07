import { routerReducer as routing } from "react-router-redux";
import { combineReducers } from "redux";

import auth from "./auth";
import paginate from "./paginate";

import * as ActionTypes from "../actions";

// Updates the pagination data for different actions.
const pagination = combineReducers({
    artists: paginate([
        ActionTypes.ARTISTS_REQUEST,
        ActionTypes.ARTISTS_SUCCESS,
        ActionTypes.ARTISTS_FAILURE
    ]),
    albums: paginate([
        ActionTypes.ALBUMS_REQUEST,
        ActionTypes.ALBUMS_SUCCESS,
        ActionTypes.ALBUMS_FAILURE
    ]),
    songs: paginate([
        ActionTypes.SONGS_REQUEST,
        ActionTypes.SONGS_SUCCESS,
        ActionTypes.SONGS_FAILURE
    ])
});

const rootReducer = combineReducers({
    routing,
    auth,
    pagination
});

export default rootReducer;
