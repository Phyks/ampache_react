/**
 * This file defines API related models.
 */

// NPM imports
import { Schema, arrayOf } from "normalizr";


// Define normalizr schemas for major entities returned by the API
export const artist = new Schema("artist");  /** Artist schema */
export const album = new Schema("album");  /** Album schema */
export const song = new Schema("song");  /** Song schema */

// Explicit relations between them
artist.define({  // Artist has albums and songs (tracks)
    albums: arrayOf(album),
    songs: arrayOf(song),
});

album.define({  // Album has artist, tracks and tags
    artist: artist,
    tracks: arrayOf(song),
});

song.define({  // Track has artist and album
    artist: artist,
    album: album,
});
