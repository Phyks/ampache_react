import Immutable from "immutable";

export const stateRecord = new Immutable.Record({
    isFetching: false,
    items: new Immutable.List(),
    error: null,
    currentPage: 1,
    nPages: 1
});
