import Immutable from "immutable";

export const tokenRecord = Immutable.Record({
    token: null,
    expires: null
});

export const stateRecord = new Immutable.Record({
    token: tokenRecord,
    username: null,
    endpoint: null,
    rememberMe: false,
    isAuthenticated: false,
    isAuthenticating: false,
    error: null,
    info: null,
    timerID: null
});
