import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actionCreators from "../actions";
import { DEFAULT_LIMIT } from "../reducers/paginate";

import Artists from "../components/Artists";

export class ArtistsPage extends Component {
    componentWillMount () {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        // Load the data
        this.props.actions.loadArtists({pageNumber: currentPage});
    }

    componentWillReceiveProps (nextProps) {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        const nextPage = parseInt(nextProps.location.query.page) || 1;
        if (currentPage != nextPage) {
            // Load the data
            this.props.actions.loadArtists({pageNumber: nextPage});
        }
    }

    render () {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        return (
            <Artists artists={this.props.artistsList} artistsTotalCount={this.props.artistsCount} artistsPerPage={DEFAULT_LIMIT} currentPage={currentPage} location={this.props.location} />
        );
    }
}

const mapStateToProps = (state) => ({
    artistsList: state.pagination.artists.items,
    artistsCount: state.pagination.artists.total
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistsPage);
