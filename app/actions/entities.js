/**
 * This file implements actions related to global entities store.
 */

export const PUSH_ENTITIES = "PUSH_ENTITIES";
/**
 * Push some entities in the global entities store.
 *
 * @param   entities    An entities mapping, such as the one in the entities
 *                      store: type => id => entity.
 * @param   refCountType    An array of entities type to consider for
 *                          increasing reference counting (elements loaded as nested objects)
 * @return  A PUSH_ENTITIES action.
 */
export function pushEntities(entities, refCountType=["album", "artist", "song"]) {
    return {
        type: PUSH_ENTITIES,
        payload: {
            entities: entities,
            refCountType: refCountType
        }
    };
}


export const INCREMENT_REFCOUNT = "INCREMENT_REFCOUNT";
/**
 * Increment the reference counter for given entities.
 *
 * @param   ids     A mapping type => list of IDs, each ID being the one of an
 *                  entity to increment reference counter. List of IDs must be
 *                  a JS Object.
 * @return  An INCREMENT_REFCOUNT action.
 */
export function incrementRefCount(entities) {
    return {
        type: INCREMENT_REFCOUNT,
        payload: {
            entities: entities
        }
    };
}


export const DECREMENT_REFCOUNT = "DECREMENT_REFCOUNT";
/**
 * Decrement the reference counter for given entities.
 *
 * @param   ids     A mapping type => list of IDs, each ID being the one of an
 *                  entity to decrement reference counter. List of IDs must be
 *                  a JS Object.
 * @return  A DECREMENT_REFCOUNT action.
 */
export function decrementRefCount(entities) {
    return {
        type: DECREMENT_REFCOUNT,
        payload: {
            entities: entities
        }
    };
}
