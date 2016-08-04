import Immutable from "immutable";

export const stateRecord = new Immutable.Record({
    isFetching: false,
    result: new Immutable.Map(),
    entities: new Immutable.Map(),
    error: null,
    currentPage: 1,
    nPages: 1
});
