import React, { Component, PropTypes } from "react";
import { Link, withRouter } from "react-router";

export class Pagination extends Component {
    constructor(props) {
        super(props);
        this.buildLinkTo.bind(this);
    }

    computePaginationBounds(currentPage, nPages, maxNumberPagesShown=5) {
        // Taken from http://stackoverflow.com/a/8608998/2626416
        var lowerLimit = currentPage;
        var upperLimit = currentPage;

        for (var b = 1; b < maxNumberPagesShown && b < nPages;) {
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
            upperLimit: upperLimit + 1  // +1 to ease iteration in for with <
        };
    }

    buildLinkTo(pageNumber) {
        return {
            pathname: this.props.location.pathname,
            query: Object.assign({}, this.props.location.query, { page: pageNumber })
        };
    }

    goToPage() {
        const pageNumber = parseInt(this.refs.pageInput.value);
        $(this.refs.paginationModal).modal("hide");
        if (pageNumber) {
            this.props.router.push(this.buildLinkTo(pageNumber));
        }
    }

    dotsOnClick() {
        $(this.refs.paginationModal).modal();
    }

    dotsOnKeyDown(ev) {
        ev.preventDefault;
        const code = ev.keyCode || ev.which;
        if (code == 13 || code == 32) {  // Enter or Space key
            this.dotsOnClick();  // Fire same event as onClick
        }
    }

    cancelModalBox() {
        $(this.refs.paginationModal).modal("hide");
    }

    render () {
        const { lowerLimit, upperLimit } = this.computePaginationBounds(this.props.currentPage, this.props.nPages);
        var pagesButton = [];
        var key = 0;  // key increment to ensure correct ordering
        if (lowerLimit > 1) {
            // Push first page
            pagesButton.push(
                <li className="page-item" key={key}>
                    <Link className="page-link" title="Go to page 1" to={this.buildLinkTo(1)}><span className="sr-only">Go to page </span>1</Link>
                </li>
            );
            key++;
            if (lowerLimit > 2) {
                // Eventually push "…"
                pagesButton.push(
                    <li className="page-item" key={key}>
                        <span tabIndex="0" role="button" onKeyDown={this.dotsOnKeyDown.bind(this)} onClick={this.dotsOnClick.bind(this)}>&hellip;</span>
                    </li>
                );
                key++;
            }
        }
        var i = 0;
        for (i = lowerLimit; i < upperLimit; i++) {
            var className = "page-item";
            var currentSpan = null;
            if (this.props.currentPage == i) {
                className += " active";
                currentSpan = <span className="sr-only">(current)</span>;
            }
            const title = "Go to page " + i;
            pagesButton.push(
                <li className={className} key={key}>
                    <Link className="page-link" title={title} to={this.buildLinkTo(i)}><span className="sr-only">Go to page </span>{i} {currentSpan}</Link>
                </li>
            );
            key++;
        }
        if (i < this.props.nPages) {
            if (i < this.props.nPages - 1) {
                // Eventually push "…"
                pagesButton.push(
                    <li className="page-item" key={key}>
                        <span tabIndex="0" role="button" onKeyDown={this.dotsOnKeyDown.bind(this)} onClick={this.dotsOnClick.bind(this)}>&hellip;</span>
                    </li>
                );
                key++;
            }
            const title = "Go to page " + this.props.nPages;
            // Push last page
            pagesButton.push(
                <li className="page-item" key={key}>
                    <Link className="page-link" title={title} to={this.buildLinkTo(this.props.nPages)}><span className="sr-only">Go to page </span>{this.props.nPages}</Link>
                </li>
            );
        }
        if (pagesButton.length > 1) {
            return (
                <div>
                    <nav className="pagination-nav" aria-label="Page navigation">
                        <ul className="pagination">
                            { pagesButton }
                        </ul>
                    </nav>
                    <div className="modal fade" ref="paginationModal" tabIndex="-1" role="dialog" aria-labelledby="paginationModalLabel">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">&times;</button>
                                    <h4 className="modal-title" id="paginationModalLabel">Page to go to?</h4>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <input className="form-control" autoComplete="off" type="number" ref="pageInput" aria-label="Page number to go to" />
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" onClick={this.cancelModalBox.bind(this)}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.goToPage.bind(this)}>OK</button>
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

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    nPages: PropTypes.number.isRequired
};

export default withRouter(Pagination);
