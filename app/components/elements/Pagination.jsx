import React, { Component, PropTypes } from "react";
import { Link, withRouter } from "react-router";
import $ from "jquery";

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
        $("#paginationModal").modal("hide");
        this.props.router.push(this.buildLinkTo(pageNumber));
    }

    render () {
        const { lowerLimit, upperLimit } = this.computePaginationBounds(this.props.currentPage, this.props.nPages);
        var pagesButton = [];
        var key = 0;  // key increment to ensure correct ordering
        if (lowerLimit > 1) {
            // Push first page
            pagesButton.push(
                <li className="page-item" key={key}>
                    <Link className="page-link" to={this.buildLinkTo(1)}>1</Link>
                </li>
            );
            key++;
            if (lowerLimit > 2) {
                // Eventually push "…"
                pagesButton.push(
                    <li className="page-item" key={key}>
                        <span onClick={() => $("#paginationModal").modal() }>…</span>
                    </li>
                );
                key++;
            }
        }
        var i = 0;
        for (i = lowerLimit; i < upperLimit; i++) {
            var className = "page-item";
            if (this.props.currentPage == i) {
                className += " active";
            }
            pagesButton.push(
                <li className={className} key={key}>
                    <Link className="page-link" to={this.buildLinkTo(i)}>{i}</Link>
                </li>
            );
            key++;
        }
        if (i < this.props.nPages) {
            if (i < this.props.nPages - 1) {
                // Eventually push "…"
                pagesButton.push(
                    <li className="page-item" key={key}>
                        <span onClick={() => $("#paginationModal").modal() }>…</span>
                    </li>
                );
                key++;
            }
            // Push last page
            pagesButton.push(
                <li className="page-item" key={key}>
                    <Link className="page-link" to={this.buildLinkTo(this.props.nPages)}>{this.props.nPages}</Link>
                </li>
            );
        }
        if (pagesButton.length > 1) {
            return (
                <div>
                    <nav className="pagination-nav">
                        <ul className="pagination">
                            { pagesButton }
                        </ul>
                    </nav>
                    <div className="modal fade" id="paginationModal" tabIndex="-1" role="dialog" aria-hidden="false">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                    <h4 className="modal-title">Page to go to?</h4>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <input className="form-control" autoComplete="off" type="number" ref="pageInput" />
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" onClick={ () => $("#paginationModal").modal("hide") }>Cancel</button>
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
