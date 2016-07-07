import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actionCreators from "../actions";
import { DEFAULT_LIMIT } from "../reducers/paginate";

import Albums from "../components/Albums";

export class AlbumsPage extends Component {
    componentWillMount () {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        // Load the data
        this.props.actions.loadAlbums({pageNumber: currentPage});
    }

    componentWillReceiveProps (nextProps) {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        const nextPage = parseInt(nextProps.location.query.page) || 1;
        if (currentPage != nextPage) {
            // Load the data
            this.props.actions.loadAlbums({pageNumber: nextPage});
        }
    }

    render () {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        return (
            <Albums albums={this.props.albumsList} albumsTotalCount={this.props.albumsCount} albumsPerPage={DEFAULT_LIMIT} currentPage={currentPage} location={this.props.location} />
        );
    }
}

const mapStateToProps = (state) => ({
    albumsList: state.pagination.albums.items,
    albumsCount: state.pagination.albums.total
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumsPage);
