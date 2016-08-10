// NPM imports
import React, { Component, PropTypes } from "react";
import Immutable from "immutable";

// Other components
import FilterablePaginatedGrid from "./elements/Grid";
import DismissibleAlert from "./elements/DismissibleAlert";


/**
 * Paginated artists grid
 */
export default class Artists extends Component {
    render() {
        // Handle error
        let error = null;
        if (this.props.error) {
            error =  (<DismissibleAlert type="danger" text={this.props.error} />);
        }

        // Define grid props
        const grid = {
            isFetching: this.props.isFetching,
            items: this.props.artists,
            itemsType: "artist",
            itemsLabel: "app.common.artist",
            subItemsType: "albums",
            subItemsLabel: "app.common.album",
        };

        return (
            <div>
                { error }
                <FilterablePaginatedGrid grid={grid} pagination={this.props.pagination} />
            </div>
        );
    }
}
Artists.propTypes = {
    error: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    artists: PropTypes.instanceOf(Immutable.List).isRequired,
    pagination: PropTypes.object.isRequired,
};
