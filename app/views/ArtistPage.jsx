import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Immutable from "immutable";

import * as actionCreators from "../actions";

import Artist from "../components/Artist";

export class ArtistPage extends Component {
    componentWillMount () {
        // Load the data
        this.props.actions.loadArtists({
            pageNumber: 1,
            filter: this.props.params.id,
            include: ["albums", "songs"]
        });
    }

    render () {
        if (this.props.artist) {
            return (
                <Artist artist={this.props.artist} albums={this.props.albums} songs={this.props.songs} />
            );
        }
        return (
            <div></div>
        );  // TODO: Loading
    }
}

const mapStateToProps = (state, ownProps) => {
    const artists = state.api.entities.get("artist");
    let artist = undefined;
    let albums = new Immutable.List();
    let songs = new Immutable.List();
    if (artists) {
        // Get artist
        artist = artists.find(
            item => item.get("id") == ownProps.params.id
        );
        // Get albums
        const artistAlbums = artist.get("albums");
        if (Immutable.List.isList(artistAlbums)) {
            albums = new Immutable.Map(
                artistAlbums.map(
                    id => [id, state.api.entities.getIn(["album", id])]
                )
            );
        }
        // Get songs
        const artistSongs = artist.get("songs");
        if (Immutable.List.isList(artistSongs)) {
            songs = new Immutable.Map(
                artistSongs.map(
                    id => [id, state.api.entities.getIn(["track", id])]
                )
            );
        }
    }
    return {
        artist: artist,
        albums: albums,
        songs: songs
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistPage);
