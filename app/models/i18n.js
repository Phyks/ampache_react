/**
 * This file defines i18n related models.
 */

// NPM import
import Immutable from "immutable";

/** i18n record for passing errors to be localized from actions to components */
export const i18nRecord = new Immutable.Record({
    id: null,  /** Translation message id */
    values: new Immutable.Map()  /** Values to pass to formatMessage */
});
