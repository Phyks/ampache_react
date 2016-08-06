import React, { Component, PropTypes } from "react";
import Immutable from "immutable";

import FilterablePaginatedGrid from "./elements/Grid";
import DismissibleAlert from "./elements/DismissibleAlert";

class Artists extends Component {
    render () {
        let error = null;
        if (this.props.error) {
            error =  (<DismissibleAlert type="danger" text={this.props.error} />);
        }

        const grid = {
            isFetching: this.props.isFetching,
            items: this.props.artists,
            itemsType: "artist",
            itemsLabel: "app.common.artist",
            subItemsType: "albums",
            subItemsLabel: "app.common.album"
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
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string,
    artists: PropTypes.instanceOf(Immutable.List).isRequired,
    pagination: PropTypes.object.isRequired,
};

export default Artists;
