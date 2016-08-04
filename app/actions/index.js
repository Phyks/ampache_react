export * from "./auth";

import APIAction from "./APIActions";

export const API_SUCCESS = "API_SUCCESS";
export const API_REQUEST = "API_REQUEST";
export const API_FAILURE = "API_FAILURE";
export var { loadArtists } = APIAction("artists", API_REQUEST, API_SUCCESS, API_FAILURE);
export var { loadAlbums } = APIAction("albums", API_REQUEST, API_SUCCESS, API_FAILURE);
export var { loadSongs } = APIAction("songs", API_REQUEST, API_SUCCESS, API_FAILURE);

export * from "./paginate";
export * from "./store";
