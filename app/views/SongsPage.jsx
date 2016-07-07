import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actionCreators from "../actions";
import { DEFAULT_LIMIT } from "../reducers/paginate";

import Songs from "../components/Songs";

export class SongsPage extends Component {
    componentWillMount () {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        // Load the data
        this.props.actions.loadSongs({pageNumber: currentPage});
    }

    componentWillReceiveProps (nextProps) {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        const nextPage = parseInt(nextProps.location.query.page) || 1;
        if (currentPage != nextPage) {
            // Load the data
            this.props.actions.loadSongs({pageNumber: nextPage});
        }
    }

    render () {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        return (
            <Songs songs={this.props.songsList} songsTotalCount={this.props.songsCount} songsPerPage={DEFAULT_LIMIT} currentPage={currentPage} location={this.props.location} />
        );
    }
}

const mapStateToProps = (state) => ({
    songsList: state.pagination.songs.items,
    songsCount: state.pagination.songs.total
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SongsPage);
