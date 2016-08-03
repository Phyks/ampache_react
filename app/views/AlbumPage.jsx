import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actionCreators from "../actions";

import Album from "../components/Album";

// TODO: AlbumPage should be scrolled ArtistPage

export class AlbumPage extends Component {
    componentWillMount () {
        // Load the data
        this.props.actions.loadAlbums({
            pageNumber: 1,
            filter: this.props.params.id,
            include: ["songs"]
        });
    }

    render () {
        const album = this.props.albums.find(
            item => item.id == this.props.params.id
        );
        if (album) {
            return (
                <Album album={album} />
            );
        }
        return null;  // Loading
    }
}

const mapStateToProps = (state) => ({
    albums: state.pagination.albums.items
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumPage);
