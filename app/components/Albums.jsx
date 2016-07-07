import React, { Component, PropTypes } from "react";

import FilterablePaginatedGrid from "./elements/Grid";

export default class Albums extends Component {
    render () {
        return (
            <FilterablePaginatedGrid items={this.props.albums} itemsTotalCount={this.props.albumsTotalCount} itemsPerPage={this.props.albumsPerPage} currentPage={this.props.currentPage} location={this.props.location} itemsType="albums" subItemsType="tracks" />
        );
    }
}

Albums.propTypes = {
    albums: PropTypes.array.isRequired,
    albumsTotalCount: PropTypes.number.isRequired,
    albumsPerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired
};
