import React, { Component, PropTypes } from "react";
import Immutable from "immutable";

import FilterablePaginatedGrid from "./elements/Grid";

class Artists extends Component {
    render () {
        const grid = {
            isFetching: this.props.isFetching,
            items: this.props.artists,
            itemsType: "artist",
            itemsLabel: "app.common.artist",
            subItemsType: "albums",
            subItemsLabel: "app.common.album"
        };
        return (
            <FilterablePaginatedGrid grid={grid} pagination={this.props.pagination} />
        );
    }
}

Artists.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    artists: PropTypes.instanceOf(Immutable.List).isRequired,
    pagination: PropTypes.object.isRequired,
};

export default Artists;
