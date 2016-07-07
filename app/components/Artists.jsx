import React, { Component, PropTypes } from "react";

import FilterablePaginatedGrid from "./elements/Grid";

export default class Artists extends Component {
    render () {
        return (
            <FilterablePaginatedGrid items={this.props.artists} itemsTotalCount={this.props.artistsTotalCount} itemsPerPage={this.props.artistsPerPage} currentPage={this.props.currentPage} location={this.props.location} itemsType="artists" subItemsType="albums" />
        );
    }
}

Artists.propTypes = {
    artists: PropTypes.array.isRequired,
    artistsTotalCount: PropTypes.number.isRequired,
    artistsPerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired
};
