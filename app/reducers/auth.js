import Cookies from "js-cookie";

import {LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER} from "../actions";
import { createReducer } from "../utils";

var initialToken = Cookies.getJSON("token");
if (initialToken) {
    initialToken.expires = new Date(initialToken.expires);
}

const initialState = {
    token: initialToken || {
        token: "",
        expires: null
    },
    username: Cookies.get("username"),
    endpoint: Cookies.get("endpoint"),
    rememberMe: Boolean(Cookies.get("username") && Cookies.get("endpoint")),
    isAuthenticated: false,
    isAuthenticating: false,
    error: "",
    info: "",
    timerID: null
};

export default createReducer(initialState, {
    [LOGIN_USER_REQUEST]: (state) => {
        return Object.assign({}, state, {
            isAuthenticating: true,
            info: {
                id: "app.login.connecting",
                values: {}
            },
            error: "",
            timerID: null
        });
    },
    [LOGIN_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: true,
            token: payload.token,
            username: payload.username,
            endpoint: payload.endpoint,
            rememberMe: payload.rememberMe,
            info: {
                id: "app.login.success",
                values: { username: payload.username}
            },
            error: "",
            timerID: payload.timerID
        });

    },
    [LOGIN_USER_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            token: initialState.token,
            username: "",
            endpoint: "",
            rememberMe: false,
            info: "",
            error: payload.error,
            timerID: 0
        });
    },
    [LOGOUT_USER]: (state) => {
        return Object.assign({}, state, {
            isAuthenticated: false,
            token: initialState.token,
            username: "",
            endpoint: "",
            rememberMe: false,
            info: {
                id: "app.login.byebye",
                values: {}
            },
            error: "",
            timerID: 0
        });
    }
});
