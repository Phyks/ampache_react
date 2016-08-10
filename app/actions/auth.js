/**
 * This file implements authentication related actions.
 */

// NPM imports
import { push } from "react-router-redux";
import Cookies from "js-cookie";

// Local imports
import { buildHMAC, cleanURL } from "../utils";

// Models
import { i18nRecord } from "../models/i18n";

// Other actions and payload types
import { CALL_API } from "../middleware/api";
import { invalidateStore } from "./store";


// Constants
export const DEFAULT_SESSION_INTERVAL = 1800 * 1000;  // 30 mins long sessoins by default


/**
 * Dispatch a ping query to the API for login keepalive and prevent session
 * from expiring.
 *
 * @param   username    Username to use
 * @param   token       Token to revive
 * @param   endpoint    Ampache base URL
 *
 * @return A CALL_API payload to keep session alive.
 */
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
/**
 * Action to be called on successful login.
 *
 * @param   username    Username used for login
 * @param   token       Token got back from the API
 * @param   endpoint    Ampache server base URL
 * @param   rememberMe  Whether to remember me or not
 * @param   timerID     ID of the timer set for session keepalive.
 *
 * @return A login success payload.
 */
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
/**
 * Action to be called on failed login.
 *
 * This action removes any remember me cookie if any was set.
 *
 * @param   error   An error object, either string or i18nRecord.
 * @return  A login failure payload.
 */
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


export const LOGIN_USER_EXPIRED = "LOGIN_USER_EXPIRED";
/**
 * Action to be called when session is expired.
 *
 * @param   error   An error object, either a string or i18nRecord.
 * @return  A session expired payload.
 */
export function loginUserExpired(error) {
    return {
        type: LOGIN_USER_EXPIRED,
        payload: {
            error: error
        }
    };
}


export const LOGIN_USER_REQUEST = "LOGIN_USER_REQUEST";
/**
 * Action to be called when login is requested.
 *
 * @return  A login request payload.
 */
export function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST
    };
}


export const LOGOUT_USER = "LOGOUT_USER";
/**
 * Action to be called upon logout.
 *
 * This function clears the cookies set for remember me and the keep alive
 * timer.
 *
 * @remark  This function does not clear the other stores, nor handle
 *          redirection.
 *
 * @return  A logout payload.
 */
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


/**
 * Action to be called to log a user out.
 *
 * This function clears the remember me cookies and the keepalive timer. It
 * also clears the data behind authentication in the store and redirects to
 * login page.
 */
export function logoutAndRedirect() {
    return (dispatch) => {
        dispatch(logout());
        dispatch(invalidateStore());
        dispatch(push("/login"));
    };
}


/**
 * Action to be called to log a user in.
 *
 * @param   username    Username to use.
 * @param   passwordOrToken     User password, or previous token to revive.
 * @param   endpoint    Ampache server base URL.
 * @param   rememberMe  Whether to rememberMe or not
 * @param[optional]     redirect    Page to redirect to after login.
 * @param[optional]     isToken     Whether passwordOrToken is a password or a
 *                                  token.
 *
 * @return  A CALL_API payload to perform login.
 */
export function loginUser(username, passwordOrToken, endpoint, rememberMe, redirect="/", isToken=false) {
    // Clean endpoint
    endpoint = cleanURL(endpoint);

    // Get passphrase and time parameters
    let time = 0;
    let passphrase = passwordOrToken;
    if (!isToken) {
        // Standard password connection
        const HMAC = buildHMAC(passwordOrToken);
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
                        // On success, check that we are actually authenticated
                        return dispatch(loginUserFailure(new i18nRecord({ id: "app.api.error", values: {} })));
                    }
                    // Get token from the API
                    const token = {
                        token: jsonData.auth,
                        expires: new Date(jsonData.sessionExpire)
                    };
                    // Handle session keep alive timer
                    const timerID = setInterval(
                        () => dispatch(loginKeepAlive(username, token.token, endpoint)),
                        DEFAULT_SESSION_INTERVAL
                    );
                    if (rememberMe) {
                        // Handle remember me option
                        const cookiesOption = { expires: token.expires };
                        Cookies.set("username", username, cookiesOption);
                        Cookies.set("token", token, cookiesOption);
                        Cookies.set("endpoint", endpoint, cookiesOption);
                    }
                    // Dispatch login success
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
