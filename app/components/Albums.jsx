import React, { Component, PropTypes } from "react";
import Immutable from "immutable";

import FilterablePaginatedGrid from "./elements/Grid";
import DismissibleAlert from "./elements/DismissibleAlert";

export default class Albums extends Component {
    render () {
        let error = null;
        if (this.props.error) {
            error =  (<DismissibleAlert type="danger" text={this.props.error} />);
        }

        const grid = {
            isFetching: this.props.isFetching,
            items: this.props.albums,
            itemsType: "album",
            itemsLabel: "app.common.album",
            subItemsType: "tracks",
            subItemsLabel: "app.common.track"
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
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string,
    albums: PropTypes.instanceOf(Immutable.List).isRequired,
    pagination: PropTypes.object.isRequired,
};
