export * from "./auth";

import APIAction from "./APIActions";

export const ARTISTS_SUCCESS = "ARTISTS_SUCCESS";
export const ARTISTS_REQUEST = "ARTISTS_REQUEST";
export const ARTISTS_FAILURE = "ARTISTS_FAILURE";
export var { loadArtists } = APIAction("artists", ARTISTS_REQUEST, ARTISTS_SUCCESS, ARTISTS_FAILURE);

export const ALBUMS_SUCCESS = "ALBUMS_SUCCESS";
export const ALBUMS_REQUEST = "ALBUMS_REQUEST";
export const ALBUMS_FAILURE = "ALBUMS_FAILURE";
export var { loadAlbums } = APIAction("albums", ALBUMS_REQUEST, ALBUMS_SUCCESS, ALBUMS_FAILURE);

export const SONGS_SUCCESS = "SONGS_SUCCESS";
export const SONGS_REQUEST = "SONGS_REQUEST";
export const SONGS_FAILURE = "SONGS_FAILURE";
export var { loadSongs } = APIAction("songs", SONGS_REQUEST, SONGS_SUCCESS, SONGS_FAILURE);
