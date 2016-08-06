import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Immutable from "immutable";

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
        if (this.props.album) {
            return (
                <Album album={this.props.album} songs={this.props.songs} />
            );
        }
        return (
            <div></div>
        );  // TODO: Loading + error
    }
}

const mapStateToProps = (state, ownProps) => {
    const albums = state.api.entities.get("album");
    let album = undefined;
    let songs = new Immutable.List();
    if (albums) {
        // Get artist
        album = albums.find(
            item => item.get("id") == ownProps.params.id
        );
        // Get songs
        const tracks = album.get("tracks");
        if (Immutable.List.isList(tracks)) {
            songs = new Immutable.List(
                tracks.map(
                    id => state.api.entities.getIn(["track", id])
                )
            );
        }
    }
    return {
        album: album,
        songs: songs
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumPage);
