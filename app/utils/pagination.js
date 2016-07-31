export function buildPaginationObject(location, currentPage, nPages, goToPageAction) {
    const buildLinkToPage = function (pageNumber) {
        return {
            pathname: location.pathname,
            query: Object.assign({}, location.query, { page: pageNumber })
        };
    };
    return {
        currentPage: currentPage,
        nPages: nPages,
        goToPage: pageNumber => goToPageAction(buildLinkToPage(pageNumber)),
        buildLinkToPage: buildLinkToPage
    };
}
