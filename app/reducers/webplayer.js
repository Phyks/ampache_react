// TODO: This is a WIP
import Immutable from "immutable";

import {
    PUSH_PLAYLIST,
    CHANGE_TRACK,
    PLAY_PAUSE,
    TOGGLE_RANDOM,
    TOGGLE_REPEAT,
    TOGGLE_MUTE,
    INVALIDATE_STORE } from "../actions";
import { createReducer } from "../utils";
import { stateRecord } from "../models/webplayer";

/**
 * Initial state
 */

var initialState = new stateRecord();


/**
 * Reducers
 */

export default createReducer(initialState, {
    [PLAY_PAUSE]: (state, payload) => {
        return state.set("isPlaying", payload.isPlaying);
    },
    [CHANGE_TRACK]: (state, payload) => {
        return state.set("currentIndex", payload.index);
    },
    [PUSH_PLAYLIST]: (state, payload) => {
        return (
            state
            .set("playlist", new Immutable.List(payload.playlist))
            .setIn(["entities", "artists"], new Immutable.Map(payload.artists))
            .setIn(["entities", "albums"], new Immutable.Map(payload.albums))
            .setIn(["entities", "tracks"], new Immutable.Map(payload.tracks))
            .set("currentIndex", 0)
            .set("isPlaying", true)
        );
    },
    [TOGGLE_RANDOM]: (state) => {
        return state.set("isRandom", !state.get("isRandom"));
    },
    [TOGGLE_REPEAT]: (state) => {
        return state.set("isRepeat", !state.get("isRepeat"));
    },
    [TOGGLE_MUTE]: (state) => {
        return state.set("isMute", !state.get("isMute"));
    },
    [INVALIDATE_STORE]: () => {
        return new stateRecord();
    }
});
