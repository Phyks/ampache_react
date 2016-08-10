/**
 * Export all the available actions
 */

// Auth related actions
export * from "./auth";

// API related actions for all the available types
import APIAction from "./APIActions";

// Actions related to API
export const API_SUCCESS = "API_SUCCESS";
export const API_REQUEST = "API_REQUEST";
export const API_FAILURE = "API_FAILURE";
export var {
    loadPaginatedArtists, loadArtist } = APIAction("artists", API_REQUEST, API_SUCCESS, API_FAILURE);
export var {
    loadPaginatedAlbums, loadAlbum } = APIAction("albums", API_REQUEST, API_SUCCESS, API_FAILURE);
export var {
    loadPaginatedSongs, loadSong } = APIAction("songs", API_REQUEST, API_SUCCESS, API_FAILURE);

// Entities actions
export * from "./entities";

// Paginated views store actions
export * from "./paginated";

// Pagination actions
export * from "./pagination";

// Store actions
export * from "./store";

// Webplayer actions
export * from "./webplayer";
