// NPM import
import Immutable from "immutable";

/** Record to store the paginated pages state. */
export const stateRecord = new Immutable.Record({
    type: null,  /** Type of the paginated entries */
    result: new Immutable.List(),  /** List of IDs of the resulting entries, maps to the entities store */
    currentPage: 1,  /** Number of current page */
    nPages: 1  /** Total number of page in this batch */
});
