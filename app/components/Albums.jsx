// NPM imports
import React, { Component, PropTypes } from "react";
import Immutable from "immutable";

// Local imports
import FilterablePaginatedGrid from "./elements/Grid";
import DismissibleAlert from "./elements/DismissibleAlert";


/**
 * Paginated albums grid
 */
export default class Albums extends Component {
    render() {
        // Handle error
        let error = null;
        if (this.props.error) {
            error =  (<DismissibleAlert type="danger" text={this.props.error} />);
        }

        // Set grid props
        const grid = {
            isFetching: this.props.isFetching,
            items: this.props.albums,
            itemsType: "album",
            itemsLabel: "app.common.album",
            subItemsType: "tracks",
            subItemsLabel: "app.common.track",
        };

        return (
            <div>
                { error }
                <FilterablePaginatedGrid grid={grid} pagination={this.props.pagination} />
            </div>
        );
    }
}
Albums.propTypes = {
    error: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    albums: PropTypes.instanceOf(Immutable.List).isRequired,
    pagination: PropTypes.object.isRequired,
};
