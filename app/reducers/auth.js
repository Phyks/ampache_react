/**
 * This implements the auth reducer, storing and updating authentication state.
 */

// NPM imports
import Cookies from "js-cookie";

// Local imports
import { createReducer } from "../utils";

// Models
import { i18nRecord } from "../models/i18n";
import { tokenRecord, stateRecord } from "../models/auth";

// Actions
import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGIN_USER_EXPIRED,
    LOGOUT_USER } from "../actions";


/**
 * Initial state, load data from cookies if set
 */
var initialState = new stateRecord();
// Get token
const initialToken = Cookies.getJSON("token");
if (initialToken) {
    initialToken.expires = new Date(initialToken.expires);
    initialState = initialState.set(
        "token",
        new tokenRecord({ token: initialToken.token, expires: new Date(initialToken.expires) })
    );
}
// Get username
const initialUsername = Cookies.get("username");
if (initialUsername) {
    initialState = initialState.set(
        "username",
        initialUsername
    );
}
// Get endpoint
const initialEndpoint = Cookies.get("endpoint");
if (initialEndpoint) {
    initialState = initialState.set(
        "endpoint",
        initialEndpoint
    );
}
// Set remember me
if (initialUsername && initialEndpoint) {
    initialState = initialState.set(
        "rememberMe",
        true
    );
}


/**
 * Reducers
 */
export default createReducer(initialState, {
    [LOGIN_USER_REQUEST]: () => {
        return new stateRecord({
            isAuthenticating: true,
            info: new i18nRecord({
                id: "app.login.connecting",
                values: {},
            }),
        });
    },
    [LOGIN_USER_SUCCESS]: (state, payload) => {
        return new stateRecord({
            "isAuthenticated": true,
            "token": new tokenRecord(payload.token),
            "username": payload.username,
            "endpoint": payload.endpoint,
            "rememberMe": payload.rememberMe,
            "info": new i18nRecord({
                id: "app.login.success",
                values: {username: payload.username},
            }),
            "timerID": payload.timerID,
        });
    },
    [LOGIN_USER_FAILURE]: (state, payload) => {
        return new stateRecord({
            "error": payload.error,
        });
    },
    [LOGIN_USER_EXPIRED]: (state, payload) => {
        return new stateRecord({
            "isAuthenticated": false,
            "error": payload.error,
        });
    },
    [LOGOUT_USER]: () => {
        return new stateRecord({
            info: new i18nRecord({
                id: "app.login.byebye",
                values: {},
            }),
        });
    },
});
