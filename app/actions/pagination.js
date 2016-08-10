/**
 * This file defines pagination related actions.
 */

// NPM imports
import { push } from "react-router-redux";

/** Define an action to go to a specific page. */
export function goToPage(pageLocation) {
    return (dispatch) => {
        // Just push the new page location in react-router.
        dispatch(push(pageLocation));
    };
}
