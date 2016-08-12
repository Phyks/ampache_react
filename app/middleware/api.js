/**
 * Redux middleware to perform API queries.
 *
 * This middleware catches the API requests and replaces them with API
 * responses.
 */
import fetch from "isomorphic-fetch";
import humps from "humps";
import X2JS from "x2js";

import { assembleURLAndParams } from "../utils";
import { i18nRecord } from "../models/i18n";

import { loginUserExpired } from "../actions/auth";

export const API_VERSION = 350001;  /** API version to use. */
export const BASE_API_PATH = "/server/xml.server.php";  /** Base API path after endpoint. */

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = "CALL_API";

// Error class to represents errors from these actions.
class APIError extends Error {}


/**
 * Check the HTTP status of the response.
 *
 * @param   response    A XHR response object.
 * @return  The response or a rejected Promise if the check failed.
 */
function _checkHTTPStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        return Promise.reject(response.statusText);
    }
}


/**
 * Parse the XML resulting from the API to JS object.
 *
 * @param   responseText    The text from the API response.
 * @return  The response as a JS object or a rejected Promise on error.
 */
function _parseToJSON(responseText) {
    let x2js = new X2JS({
        attributePrefix: "",  // No prefix for attributes
        keepCData: false,  // Do not store __cdata and toString functions
    });
    if (responseText) {
        return x2js.xml_str2json(responseText).root;
    }
    return Promise.reject(new i18nRecord({
        id: "app.api.invalidResponse",
        values: {},
    }));
}


/**
 * Check the errors returned by the API itself, in its response.
 *
 * @param   jsonData  A JS object representing the API response.
 * @return  The input data or a rejected Promise if errors are present.
 */
function _checkAPIErrors(jsonData) {
    if (jsonData.error) {
        return Promise.reject(jsonData.error);
    } else if (!jsonData) {
        // No data returned
        return Promise.reject(new i18nRecord({
            id: "app.api.emptyResponse",
            values: {},
        }));
    }
    return jsonData;
}


/**
 * Apply some fixes on the API data.
 *
 * @param   jsonData    A JS object representing the API response.
 * @return  A fixed JS object.
 */
function _uglyFixes(jsonData) {
    // Fix songs array
    let _uglyFixesSongs = function (songs) {
        return songs.map(function (song) {
            // Fix for cdata left in artist and album
            song.artist.name = song.artist.cdata;
            delete(song.artist.cdata);
            delete(song.artist.toString);
            song.album.name = song.album.cdata;
            delete(song.album.cdata);
            delete(song.album.toString);
            return song;
        });
    };

    // Fix albums array
    let _uglyFixesAlbums = function (albums) {
        return albums.map(function (album) {
            // TODO: Should go in Ampache core
            // Fix for absence of distinction between disks in the same album
            if (album.disk > 1) {
                album.name = album.name + " [Disk " + album.disk + "]";
            }

            // Fix for cdata left in artist
            album.artist.name = album.artist.cdata;
            delete(album.artist.cdata);
            delete(album.artist.toString);

            // Move songs one node top
            if (album.tracks.song) {
                album.tracks = album.tracks.song;

                // Ensure tracks is an array
                if (!Array.isArray(album.tracks)) {
                    album.tracks = [album.tracks];
                }

                // Fix tracks array
                album.tracks = _uglyFixesSongs(album.tracks);
            }
            return album;
        });
    };

    // Fix artists array
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
        jsonData.album = _uglyFixesAlbums(jsonData.album);
    }

    // Fix songs
    if (jsonData.song) {
        jsonData.song = _uglyFixesSongs(jsonData.song);
    }

    // TODO: Should go in Ampache core
    // Add sessionExpire information
    if (!jsonData.sessionExpire) {
        // Fix for Ampache not returning updated sessionExpire
        jsonData.sessionExpire = (new Date(Date.now() + 3600 * 1000)).toJSON();
    }

    return jsonData;
}


/**
 * Fetches an API response and normalizes the result.
 *
 * @param   endpoint    Base URL of your Ampache server.
 * @param   action      API action name.
 * @param   auth        API token to use.
 * @param   username    Username to use in the API.
 * @param   extraParams An object of extra parameters to pass to the API.
 *
 * @return  A fetching Promise.
 */
function doAPICall(endpoint, action, auth, username, extraParams) {
    // Translate the API action to real API action
    const APIAction = extraParams.filter ? action.rstrip("s") : action;
    // Set base params
    const baseParams = {
        version: API_VERSION,
        action: APIAction,
        auth: auth,
        user: username,
    };
    // Extend with extraParams
    const params = Object.assign({}, baseParams, extraParams);
    // Assemble the full URL with endpoint, API path and GET params
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


/**
 * A Redux middleware that interprets actions with CALL_API info specified.
 * Performs the call and promises when such actions are dispatched.
 */
export default store => next => reduxAction => {
    if (reduxAction.type !== CALL_API) {
        // Do not apply on other actions
        return next(reduxAction);
    }

    // Check payload
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

    // Get the actions to dispatch
    const [ requestDispatch, successDispatch, failureDispatch ] = dispatch;
    if (requestDispatch) {
        // Dispatch request action if needed
        store.dispatch(requestDispatch());
    }

    // Run the API call
    return doAPICall(endpoint, action, auth, username, extraParams).then(
        response => {
            if (successDispatch) {
                // Dispatch success if needed
                store.dispatch(successDispatch(response));
            }
        },
        error => {
            if (failureDispatch) {
                // Error object from the API (in the JS object)
                if (error._code && error.__cdata) {
                    // Format the error message
                    const errorMessage = error.__cdata + " (" + error._code + ")";
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
