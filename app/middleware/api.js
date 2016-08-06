import fetch from "isomorphic-fetch";
import humps from "humps";
import X2JS from "x2js";

import { assembleURLAndParams } from "../utils";
import { i18nRecord } from "../models/i18n";

import { loginUserExpired } from "../actions/auth";

export const API_VERSION = 350001;  /** API version to use. */
export const BASE_API_PATH = "/server/xml.server.php";  /** Base API path after endpoint. */

// Error class to represents errors from these actions.
class APIError extends Error {}

function _checkHTTPStatus (response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        return Promise.reject(response.statusText);
    }
}

function _parseToJSON (responseText) {
    let x2js = new X2JS({
        attributePrefix: "",
        keepCData: false
    });
    if (responseText) {
        return x2js.xml_str2json(responseText).root;
    }
    return Promise.reject(new i18nRecord({
        id: "app.api.invalidResponse",
        values: {}
    }));
}

function _checkAPIErrors (jsonData) {
    if (jsonData.error) {
        return Promise.reject(jsonData.error);
    } else if (!jsonData) {
        // No data returned
        return Promise.reject(new i18nRecord({
            id: "app.api.emptyResponse",
            values: {}
        }));
    }
    return jsonData;
}

function _uglyFixes (jsonData) {
    let _uglyFixesSongs = function (songs) {
        return songs.map(function (song) {
            // Fix for cdata left in artist and album
            song.artist.name = song.artist.cdata;
            song.album.name = song.album.cdata;
            return song;
        });
    };

    let _uglyFixesAlbums = function (albums) {
        return albums.map(function (album) {
            // TODO
            // Fix for absence of distinction between disks in the same album
            if (album.disk > 1) {
                album.name = album.name + " [Disk " + album.disk + "]";
            }

            // Move songs one node top
            if (album.tracks.song) {
                album.tracks = album.tracks.song;

                // Ensure tracks is an array
                if (!Array.isArray(album.tracks)) {
                    album.tracks = [album.tracks];
                }

                // Fix tracks
                album.tracks = _uglyFixesSongs(album.tracks);
            }
            return album;
        });
    };

    let _uglyFixesArtists = function (artists) {
        return artists.map(function (artist) {
            // Move albums one node top
            if (artist.albums.album) {
                artist.albums = artist.albums.album;

                // Ensure albums are an array
                if (!Array.isArray(artist.albums)) {
                    artist.albums = [artist.albums];
                }

                // Fix albums
                artist.albums = _uglyFixesAlbums(artist.albums);
            }

            // Move songs one node top
            if (artist.songs.song) {
                artist.songs = artist.songs.song;

                // Ensure songs are an array
                if (!Array.isArray(artist.songs)) {
                    artist.songs = [artist.songs];
                }

                // Fix songs
                artist.songs = _uglyFixesSongs(artist.songs);
            }
            return artist;
        });
    };

    // Ensure items are always wrapped in an array
    if (jsonData.artist && !Array.isArray(jsonData.artist)) {
        jsonData.artist = [jsonData.artist];
    }
    if (jsonData.album && !Array.isArray(jsonData.album)) {
        jsonData.album = [jsonData.album];
    }
    if (jsonData.song && !Array.isArray(jsonData.song)) {
        jsonData.song = [jsonData.song];
    }

    // Fix artists
    if (jsonData.artist) {
        jsonData.artist = _uglyFixesArtists(jsonData.artist);
    }

    // Fix albums
    if (jsonData.album) {
        // Fix albums
        jsonData.album = _uglyFixesAlbums(jsonData.album);
    }

    // Fix songs
    if (jsonData.song) {
        // Fix songs
        jsonData.song = _uglyFixesSongs(jsonData.song);
    }

    // TODO
    // Add sessionExpire information
    if (!jsonData.sessionExpire) {
        // Fix for Ampache not returning updated sessionExpire
        jsonData.sessionExpire = (new Date(Date.now() + 3600 * 1000)).toJSON();
    }

    return jsonData;
}

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function doAPICall (endpoint, action, auth, username, extraParams) {
    const APIAction = extraParams.filter ? action.rstrip("s") : action;
    const baseParams = {
        version: API_VERSION,
        action: APIAction,
        auth: auth,
        user: username
    };
    const params = Object.assign({}, baseParams, extraParams);
    const fullURL = assembleURLAndParams(endpoint + BASE_API_PATH, params);

    return fetch(fullURL, {
        method: "get",
    })
        .then(_checkHTTPStatus)
        .then (response => response.text())
        .then(_parseToJSON)
        .then(_checkAPIErrors)
        .then(jsonData => humps.camelizeKeys(jsonData))  // Camelize
        .then(_uglyFixes);
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = "CALL_API";

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => reduxAction => {
    if (reduxAction.type !== CALL_API) {
        // Do not apply on every action
        return next(reduxAction);
    }

    const { endpoint, action, auth, username, dispatch, extraParams } = reduxAction.payload;

    if (!endpoint || typeof endpoint !== "string") {
        throw new APIError("Specify a string endpoint URL.");
    }
    if (!action) {
        throw new APIError("Specify one of the supported API actions.");
    }
    if (!auth) {
        throw new APIError("Specify an auth token.");
    }
    if (!username) {
        throw new APIError("Specify a username.");
    }
    if (!Array.isArray(dispatch) || dispatch.length !== 3) {
        throw new APIError("Expected an array of three action dispatch.");
    }
    if (!dispatch.every(type => typeof type === "function" || type === null)) {
        throw new APIError("Expected action to dispatch to be functions or null.");
    }

    const [ requestDispatch, successDispatch, failureDispatch ] = dispatch;
    if (requestDispatch) {
        store.dispatch(requestDispatch());
    }

    return doAPICall(endpoint, action, auth, username, extraParams).then(
        response => {
            if (successDispatch) {
                store.dispatch(successDispatch(response));
            }
        },
        error => {
            if (failureDispatch) {
                const errorMessage = error.__cdata + " (" + error._code + ")";
                // Error object from the API
                if (error._code && error.__cdata) {
                    if (401 == error._code) {
                        // This is an error meaning no valid session was
                        // passed. We must perform a new handshake.
                        store.dispatch(loginUserExpired(errorMessage));
                        return;
                    }
                    // Else, form error message and continue
                    error = errorMessage;
                }
                // Else if exception was thrown
                else if (error instanceof Error) {
                    // Form error message and continue
                    error = error.message;
                }
                // Dispatch a failure event
                store.dispatch(failureDispatch(error));
            }
        }
    );
};
