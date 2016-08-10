// NPM imports
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage, FormattedHTMLMessage } from "react-intl";

// Local imports
import { computePaginationBounds, filterInt, messagesMap } from "../../utils";

// Translations
import commonMessages from "../../locales/messagesDescriptors/common";
import messages from "../../locales/messagesDescriptors/elements/Pagination";

// Styles
import css from "../../styles/elements/Pagination.scss";

// Define translations
const paginationMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));


/**
 * Pagination button bar
 */
class PaginationCSSIntl extends Component {
    constructor(props) {
        super (props);

        // Bind this
        this.goToPage = this.goToPage.bind(this);
        this.dotsOnClick = this.dotsOnClick.bind(this);
        this.dotsOnKeyDown = this.dotsOnKeyDown.bind(this);
        this.cancelModalBox = this.cancelModalBox.bind(this);
    }

    /**
     * Handle click on the "go to page" button in the modal.
     */
    goToPage(e) {
        e.preventDefault();

        // Parse and check page number
        const pageNumber = filterInt(this.refs.pageInput.value);
        if (pageNumber && !isNaN(pageNumber)) {
            // Hide the modal and go to page
            $(this.refs.paginationModal).modal("hide");
            this.props.goToPage(pageNumber);
        }
    }

    /**
     * Handle click on the ellipsis dots.
     */
    dotsOnClick() {
        // Show modal
        $(this.refs.paginationModal).modal();
    }

    /**
     * Bind key down events on ellipsis dots for a11y.
     */
    dotsOnKeyDown(e) {
        e.preventDefault;
        const code = e.keyCode || e.which;
        if (code == 13 || code == 32) {  // Enter or Space key
            this.dotsOnClick();  // Fire same event as onClick
        }
    }

    /**
     * Handle click on "cancel" in the modal box.
     */
    cancelModalBox() {
        // Hide modal
        $(this.refs.paginationModal).modal("hide");
    }

    render() {
        const { formatMessage } = this.props.intl;

        // Get bounds
        const { lowerLimit, upperLimit } = computePaginationBounds(this.props.currentPage, this.props.nPages);
        // Store buttons
        let pagesButton = [];
        let key = 0;  // key increment to ensure correct ordering

        // If lower limit is above 1, push 1 and ellipsis
        if (lowerLimit > 1) {
            pagesButton.push(
                <li className="page-item" key={key}>
                    <Link className="page-link" title={formatMessage(paginationMessages["app.pagination.goToPageWithoutMarkup"], { pageNumber: 1})} to={this.props.buildLinkToPage(1)}>
                        <FormattedHTMLMessage {...paginationMessages["app.pagination.goToPage"]} values={{ pageNumber: 1 }} />
                    </Link>
                </li>
            );
            key++;  // Always increment key after a push
            if (lowerLimit > 2) {
                // Eventually push "…"
                pagesButton.push(
                    <li className="page-item" key={key}>
                        <span tabIndex="0" role="button" onKeyDown={this.dotsOnKeyDown} onClick={this.dotsOnClick}>&hellip;</span>
                    </li>
                );
                key++;
            }
        }
        // Main buttons, between lower and upper limits
        for (let i = lowerLimit; i < upperLimit; i++) {
            let classNames = ["page-item"];
            let currentSpan = null;
            if (this.props.currentPage == i) {
                classNames.push("active");
                currentSpan = <span className="sr-only">(<FormattedMessage {...paginationMessages["app.pagination.current"]} />)</span>;
            }
            const title = formatMessage(paginationMessages["app.pagination.goToPageWithoutMarkup"], { pageNumber: i });
            pagesButton.push(
                <li className={classNames.join(" ")} key={key}>
                    <Link className="page-link" title={title} to={this.props.buildLinkToPage(i)}>
                        <FormattedHTMLMessage {...paginationMessages["app.pagination.goToPage"]} values={{ pageNumber: i }} />
                        {currentSpan}
                    </Link>
                </li>
            );
            key++;
        }
        // If upper limit is below the total number of page, show last page button
        if (upperLimit < this.props.nPages) {
            if (upperLimit < this.props.nPages - 1) {
                // Eventually push "…"
                pagesButton.push(
                    <li className="page-item" key={key}>
                        <span tabIndex="0" role="button" onKeyDown={this.dotsOnKeyDown} onClick={this.dotsOnClick}>&hellip;</span>
                    </li>
                );
                key++;
            }
            const title = formatMessage(paginationMessages["app.pagination.goToPageWithoutMarkup"], { pageNumber: this.props.nPages });
            // Push last page
            pagesButton.push(
                <li className="page-item" key={key}>
                    <Link className="page-link" title={title} to={this.props.buildLinkToPage(this.props.nPages)}>
                        <FormattedHTMLMessage {...paginationMessages["app.pagination.goToPage"]} values={{ pageNumber: this.props.nPages }} />
                    </Link>
                </li>
            );
        }

        // If there are actually some buttons, show them
        if (pagesButton.length > 1) {
            return (
                <div>
                    <nav className="pagination-nav" styleName="nav" aria-label={formatMessage(paginationMessages["app.pagination.pageNavigation"])} role="navigation" >
                        <ul className="pagination" styleName="pointer" role="group">
                            { pagesButton }
                        </ul>
                    </nav>
                    <div className="modal fade" ref="paginationModal" tabIndex="-1" role="dialog" aria-labelledby="paginationModalLabel">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label={formatMessage(paginationMessages["app.common.close"])}>&times;</button>
                                    <h4 className="modal-title" id="paginationModalLabel">
                                        <FormattedMessage {...paginationMessages["app.pagination.pageToGoTo"]} />
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={this.goToPage}>
                                        <input className="form-control" autoComplete="off" type="number" ref="pageInput" aria-label={formatMessage(paginationMessages["app.pagination.pageToGoTo"])} autoFocus />
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" onClick={this.cancelModalBox}>
                                        <FormattedMessage {...paginationMessages["app.common.cancel"]} />
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={this.goToPage}>
                                        <FormattedMessage {...paginationMessages["app.common.go"]} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}
PaginationCSSIntl.propTypes = {
    currentPage: PropTypes.number.isRequired,
    goToPage: PropTypes.func.isRequired,
    buildLinkToPage: PropTypes.func.isRequired,
    nPages: PropTypes.number.isRequired,
    intl: intlShape.isRequired,
};
export default injectIntl(CSSModules(PaginationCSSIntl, css));
