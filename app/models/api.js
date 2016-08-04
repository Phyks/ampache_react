import { Schema, arrayOf } from "normalizr";

export const artist = new Schema("artist");
export const album = new Schema("album");
export const track = new Schema("track");
export const tag = new Schema("tag");

artist.define({
    albums: arrayOf(album),
    songs: arrayOf(track)
});

album.define({
    artist: artist,
    tracks: arrayOf(track),
    tag: arrayOf(tag)
});

track.define({
    artist: artist,
    album: album
});
