export const PLAY_PAUSE = "PLAY_PAUSE";
/**
 * true to play, false to pause.
 */
export function togglePlaying(playPause) {
    return (dispatch, getState) => {
        let isPlaying = false;
        if (typeof playPause !== "undefined") {
            isPlaying = playPause;
        } else {
            isPlaying = !(getState().webplayer.isPlaying);
        }
        dispatch({
            type: PLAY_PAUSE,
            payload: {
                isPlaying: isPlaying
            }
        });
    };
}

export const PUSH_PLAYLIST = "PUSH_PLAYLIST";
export function playTrack(trackID) {
    return (dispatch, getState) => {
        const track = getState().api.entities.getIn(["track", trackID]);
        const album = getState().api.entities.getIn(["album", track.get("album")]);
        const artist = getState().api.entities.getIn(["artist", track.get("artist")]);
        dispatch({
            type: PUSH_PLAYLIST,
            payload: {
                playlist: [trackID],
                tracks: [
                    [trackID, track]
                ],
                albums: [
                    [album.get("id"), album]
                ],
                artists: [
                    [artist.get("id"), artist]
                ]
            }
        });
        dispatch(togglePlaying(true));
    };
}

export const CHANGE_TRACK = "CHANGE_TRACK";
export function playPrevious() {
    // TODO: Playlist overflow
    return (dispatch, getState) => {
        let { index } = getState().webplayer;
        dispatch({
            type: CHANGE_TRACK,
            payload: {
                index: index - 1
            }
        });
    };
}
export function playNext() {
    // TODO: Playlist overflow
    return (dispatch, getState) => {
        let { index } = getState().webplayer;
        dispatch({
            type: CHANGE_TRACK,
            payload: {
                index: index + 1
            }
        });
    };
}

export const TOGGLE_RANDOM = "TOGGLE_RANDOM";
export function toggleRandom() {
    return {
        type: TOGGLE_RANDOM
    };
}

export const TOGGLE_REPEAT = "TOGGLE_REPEAT";
export function toggleRepeat() {
    return {
        type: TOGGLE_REPEAT
    };
}

export const TOGGLE_MUTE = "TOGGLE_MUTE";
export function toggleMute() {
    return {
        type: TOGGLE_MUTE
    };
}
