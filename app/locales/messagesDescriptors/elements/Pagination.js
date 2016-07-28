const messages = [
    {
        id: "app.pagination.goToPage",
        defaultMessage: "<span className=\"sr-only\">Go to page </span>{pageNumber}",
        description: "Link content to go to page N. span is here for screen-readers"
    },
    {
        id: "app.pagination.goToPageWithoutMarkup",
        defaultMessage: "Go to page {pageNumber}",
        description: "Link title to go to page N"
    },
    {
        id: "app.pagination.pageNavigation",
        defaultMessage: "Page navigation",
        description: "ARIA label for the nav block containing pagination"
    },
    {
        id: "app.pagination.pageToGoTo",
        description: "Title of the pagination modal",
        defaultMessage: "Page to go to?"
    },
    {
        id: "app.pagination.current",
        description: "Current (page)",
        defaultMessage: "current"
    }
];

export default messages;
