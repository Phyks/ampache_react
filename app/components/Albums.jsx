import React, { Component, PropTypes } from "react";
import Immutable from "immutable";

import FilterablePaginatedGrid from "./elements/Grid";

export default class Albums extends Component {
    render () {
        const grid = {
            isFetching: this.props.isFetching,
            items: this.props.albums,
            itemsLabel: "app.common.album",
            subItemsType: "tracks",
            subItemsLabel: "app.common.track"
        };
        return (
            <FilterablePaginatedGrid grid={grid} pagination={this.props.pagination} />
        );
    }
}

Albums.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    albums: PropTypes.instanceOf(Immutable.List).isRequired,
    pagination: PropTypes.object.isRequired,
};
