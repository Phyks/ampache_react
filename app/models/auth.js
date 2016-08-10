/**
 * This file defines authentication related models.
 */

// NPM imports
import Immutable from "immutable";


/** Record to store token parameters */
export const tokenRecord = Immutable.Record({
    token: null,  /** Token string */
    expires: null  /** Token expiration date */
});


/** Record to store the full auth state */
export const stateRecord = new Immutable.Record({
    token: new tokenRecord(),  /** Auth token */
    username: null,  /** Username */
    endpoint: null,  /** Ampache server base URL */
    rememberMe: false,  /** Whether to remember me or not */
    isAuthenticated: false,  /** Whether authentication is ok or not */
    isAuthenticating: false,  /** Whether authentication is in progress or not */
    error: null,  /** An error string */
    info: null,  /** An info string */
    timerID: null  /** Timer ID for setInterval calls to revive API session */
});
