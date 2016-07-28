// TODO: Refactor using normalizr
// TODO: https://facebook.github.io/immutable-js/ ?
import fetch from "isomorphic-fetch";
import humps from "humps";
import X2JS from "x2js";

import { assembleURLAndParams } from "../utils";

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
    var x2js = new X2JS({
        attributePrefix: "",
        keepCData: false
    });
    if (responseText) {
        return x2js.xml_str2json(responseText).root;
    }
    return Promise.reject("Invalid response text.");
}

function _checkAPIErrors (jsonData) {
    if (jsonData.error) {
        return Promise.reject(jsonData.error.cdata + " (" + jsonData.error.code + ")");
    } else if (!jsonData) {
        // No data returned
        return Promise.reject("Empty response");
    }
    return jsonData;
}

function _uglyFixes (endpoint, token) {
    if (typeof _uglyFixes.artistsCount === "undefined" ) {
        _uglyFixes.artistsCount = 0;
    }
    if (typeof _uglyFixes.albumsCount === "undefined" ) {
        _uglyFixes.albumsCount = 0;
    }
    if (typeof _uglyFixes.songsCount === "undefined" ) {
        _uglyFixes.songsCount = 0;
    }

    var _uglyFixesSongs = function (songs) {
        for (var i = 0; i < songs.length; i++) {
            // Fix for name becoming title in songs objects
            songs[i].name = songs[i].title;
            // Fix for length being time in songs objects
            songs[i].length = songs[i].time;

            // Fix for cdata left in artist and album
            songs[i].artist.name = songs[i].artist.cdata;
            songs[i].album.name = songs[i].album.cdata;
        }
        return songs;
    };

    var _uglyFixesAlbums = function (albums) {
        for (var i = 0; i < albums.length; i++) {
            // Fix for absence of distinction between disks in the same album
            if (albums[i].disk > 1) {
                albums[i].name = albums[i].name + " [Disk " + albums[i].disk + "]";
            }

            // Move songs one node top
            if (albums[i].tracks.song) {
                albums[i].tracks = albums[i].tracks.song;

                // Ensure tracks is an array
                if (!Array.isArray(albums[i].tracks)) {
                    albums[i].tracks = [albums[i].tracks];
                }

                // Fix tracks
                albums[i].tracks = _uglyFixesSongs(albums[i].tracks);
            }
        }
        return albums;
    };

    return jsonData => {
        // Camelize
        jsonData = humps.camelizeKeys(jsonData);

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

        // Keep track of artists count
        if (jsonData.artists) {
            _uglyFixes.artistsCount = parseInt(jsonData.artists);
        }
        // Keep track of albums count
        if (jsonData.albums) {
            _uglyFixes.albumsCount = parseInt(jsonData.albums);
        }
        // Keep track of songs count
        if (jsonData.songs) {
            _uglyFixes.songsCount = parseInt(jsonData.songs);
        }

        if (jsonData.artist) {
            for (var i = 0; i < jsonData.artist.length; i++) {
                // Fix for artists art not included
                jsonData.artist[i].art = endpoint.replace("/server/xml.server.php", "") + "/image.php?object_id=" + jsonData.artist[i].id + "&object_type=artist&auth=" + token;

                // Move albums one node top
                if (jsonData.artist[i].albums.album) {
                    jsonData.artist[i].albums = jsonData.artist[i].albums.album;

                    // Ensure albums are an array
                    if (!Array.isArray(jsonData.artist[i].albums)) {
                        jsonData.artist[i].albums = [jsonData.artist[i].albums];
                    }

                    // Fix albums
                    jsonData.artist[i].albums = _uglyFixesAlbums(jsonData.artist[i].albums);
                }

                // Move songs one node top
                if (jsonData.artist[i].songs.song) {
                    jsonData.artist[i].songs = jsonData.artist[i].songs.song;

                    // Ensure songs are an array
                    if (!Array.isArray(jsonData.artist[i].songs)) {
                        jsonData.artist[i].songs = [jsonData.artist[i].songs];
                    }

                    // Fix songs
                    jsonData.artist[i].songs = _uglyFixesSongs(jsonData.artist[i].songs);
                }
            }
            // Store the total number of items
            jsonData.artists = _uglyFixes.artistsCount;
        }
        if (jsonData.album) {
            // Fix albums
            jsonData.album = _uglyFixesAlbums(jsonData.album);
            // Store the total number of items
            jsonData.albums = _uglyFixes.albumsCount;
        }
        if (jsonData.song) {
            // Fix songs
            jsonData.song = _uglyFixesSongs(jsonData.song);
            // Store the total number of items
            jsonData.songs = _uglyFixes.songsCount;
        }

        if (!jsonData.sessionExpire) {
            // Fix for Ampache not returning updated sessionExpire
            jsonData.sessionExpire = (new Date(Date.now() + 3600 * 1000)).toJSON();
        }

        return jsonData;
    };
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
        .then(_uglyFixes(endpoint, auth))
        .then(_checkAPIErrors);
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
                if (typeof error !== "string") {
                    error = error.message;
                }
                store.dispatch(failureDispatch(error));
            }
        }
    );
};
