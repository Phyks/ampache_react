import { push } from "react-router-redux";
import jsSHA from "jssha";
import Cookies from "js-cookie";

import { CALL_API } from "../middleware/api";

import { i18nRecord } from "../models/i18n";

export const DEFAULT_SESSION_INTERVAL = 1800 * 1000;  // 30 mins default

function _cleanEndpoint (endpoint) {
    // Handle endpoints of the form "ampache.example.com"
    if (
        !endpoint.startsWith("//") &&
            !endpoint.startsWith("http://") &&
        !endpoint.startsWith("https://"))
    {
        endpoint = window.location.protocol + "//" + endpoint;
    }
    // Remove trailing slash and store endpoint
    endpoint = endpoint.replace(/\/$/, "");
    return endpoint;
}

function _buildHMAC (password) {
    // Handle Ampache HMAC generation
    const time = Math.floor(Date.now() / 1000);

    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(password);
    const key = shaObj.getHash("HEX");

    shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(time + key);

    return {
        time: time,
        passphrase: shaObj.getHash("HEX")
    };
}

export function loginKeepAlive(username, token, endpoint) {
    return {
        type: CALL_API,
        payload: {
            endpoint: endpoint,
            dispatch: [
                null,
                null,
                error => dispatch => {
                    dispatch(loginUserFailure(error || new i18nRecord({ id: "app.login.expired", values: {}})));
                }
            ],
            action: "ping",
            auth: token,
            username: username,
            extraParams: {}
        }
    };
}

export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export function loginUserSuccess(username, token, endpoint, rememberMe, timerID) {
    return {
        type: LOGIN_USER_SUCCESS,
        payload: {
            username: username,
            token: token,
            endpoint: endpoint,
            rememberMe: rememberMe,
            timerID: timerID
        }
    };
}

export const LOGIN_USER_FAILURE = "LOGIN_USER_FAILURE";
export function loginUserFailure(error) {
    Cookies.remove("username");
    Cookies.remove("token");
    Cookies.remove("endpoint");
    return {
        type: LOGIN_USER_FAILURE,
        payload: {
            error: error
        }
    };
}

export const LOGIN_USER_REQUEST = "LOGIN_USER_REQUEST";
export function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST
    };
}

export const LOGOUT_USER = "LOGOUT_USER";
export function logout() {
    return (dispatch, state) => {
        const { auth } = state();
        if (auth.timerID) {
            clearInterval(auth.timerID);
        }
        Cookies.remove("username");
        Cookies.remove("token");
        Cookies.remove("endpoint");
        dispatch({
            type: LOGOUT_USER
        });
    };
}

export function logoutAndRedirect() {
    return (dispatch) => {
        dispatch(logout());
        dispatch(push("/login"));
    };
}

export function loginUser(username, passwordOrToken, endpoint, rememberMe, redirect="/", isToken=false) {
    endpoint = _cleanEndpoint(endpoint);
    var time = 0;
    var passphrase = passwordOrToken;

    if (!isToken) {
        // Standard password connection
        const HMAC = _buildHMAC(passwordOrToken);
        time = HMAC.time;
        passphrase = HMAC.passphrase;
    } else {
        // Remember me connection
        if (passwordOrToken.expires < new Date()) {
            // Token has expired
            return loginUserFailure("app.login.expired");
        }
        time = Math.floor(Date.now() / 1000);
        passphrase = passwordOrToken.token;
    }
    return {
        type: CALL_API,
        payload: {
            endpoint: endpoint,
            dispatch: [
                loginUserRequest,
                jsonData => dispatch => {
                    if (!jsonData.auth || !jsonData.sessionExpire) {
                        return Promise.reject(new i18nRecord({ id: "app.api.error", values: {} }));
                    }
                    const token = {
                        token: jsonData.auth,
                        expires: new Date(jsonData.sessionExpire)
                    };
                    // Dispatch success
                    const timerID = setInterval(
                        () => dispatch(loginKeepAlive(username, token.token, endpoint)),
                        DEFAULT_SESSION_INTERVAL
                    );
                    if (rememberMe) {
                        const cookiesOption = { expires: token.expires };
                        Cookies.set("username", username, cookiesOption);
                        Cookies.set("token", token, cookiesOption);
                        Cookies.set("endpoint", endpoint, cookiesOption);
                    }
                    dispatch(loginUserSuccess(username, token, endpoint, rememberMe, timerID));
                    // Redirect
                    dispatch(push(redirect));
                },
                loginUserFailure
            ],
            action: "handshake",
            auth: passphrase,
            username: username,
            extraParams: {timestamp: time}
        }
    };
}
