/**
 * Collection of helper functions to deal with pagination.
 */


/**
 * Helper function to build a pagination object to pass down the component tree.
 *
 * @param   location    react-router location props.
 * @param   currentPage Number of the current page.
 * @param   nPages      Total number of pages.
 * @param   goToPageAction  Action to dispatch to go to a specific page.
 *
 * @return  An object containing all the props for the Pagination component.
 */
export function buildPaginationObject(location, currentPage, nPages, goToPageAction) {
    const buildLinkToPage = function (pageNumber) {
        return {
            pathname: location.pathname,
            query: Object.assign({}, location.query, { page: pageNumber }),
        };
    };
    return {
        currentPage: currentPage,
        nPages: nPages,
        goToPage: pageNumber => goToPageAction(buildLinkToPage(pageNumber)),
        buildLinkToPage: buildLinkToPage,
    };
}


/**
 * Helper function to compute the buttons to display.
 *
 * Taken from http://stackoverflow.com/a/8608998/2626416
 *
 * @param   currentPage     Number of the current page.
 * @param   nPages          Total number of pages.
 * @param   maxNumberPagesShown     Maximum number of pages button to show.
 *
 * @return  An object containing lower limit and upper limit bounds.
 */
export function computePaginationBounds(currentPage, nPages, maxNumberPagesShown=5) {
    let lowerLimit = currentPage;
    let upperLimit = currentPage;

    for (let b = 1; b < maxNumberPagesShown && b < nPages;) {
        if (lowerLimit > 1 ) {
            lowerLimit--;
            b++;
        }
        if (b < maxNumberPagesShown && upperLimit < nPages) {
            upperLimit++;
            b++;
        }
    }

    return {
        lowerLimit: lowerLimit,
        upperLimit: upperLimit + 1,  // +1 to ease iteration in for with <
    };
}
