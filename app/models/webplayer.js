import Immutable from "immutable";

export const entitiesRecord = new Immutable.Record({
    artists: new Immutable.Map(),
    albums: new Immutable.Map(),
    tracks: new Immutable.Map()
});

export const stateRecord = new Immutable.Record({
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMute: false,
    currentIndex: 0,
    playlist: new Immutable.List(),
    entities: new entitiesRecord()
});
