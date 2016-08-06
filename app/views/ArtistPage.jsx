import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import Immutable from "immutable";

import * as actionCreators from "../actions";
import { messagesMap, handleErrorI18nObject } from "../utils";

import Artist from "../components/Artist";

import APIMessages from "../locales/messagesDescriptors/api";

const artistMessages = defineMessages(messagesMap(Array.concat([], APIMessages)));

class ArtistPageIntl extends Component {
    componentWillMount () {
        // Load the data
        this.props.actions.loadArtists({
            pageNumber: 1,
            filter: this.props.params.id,
            include: ["albums", "songs"]
        });
    }

    render () {
        const {formatMessage} = this.props.intl;
        const error = handleErrorI18nObject(this.props.error, formatMessage, artistMessages);
        return (
            <Artist isFetching={this.props.isFetching} error={error} artist={this.props.artist} albums={this.props.albums} songs={this.props.songs} />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const artists = state.api.entities.get("artist");
    let artist = undefined;
    let albums = new Immutable.Map();
    let songs = new Immutable.Map();
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
        isFetching: state.api.isFetching,
        error: state.api.error,
        artist: artist,
        albums: albums,
        songs: songs
    };
};

ArtistPageIntl.propTypes = {
    intl: intlShape.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ArtistPageIntl));
