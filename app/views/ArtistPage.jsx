// NPM imports
import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import Immutable from "immutable";

// Local imports
import { messagesMap, handleErrorI18nObject, filterInt } from "../utils";

// Actions
import * as actionCreators from "../actions";

// Components
import Artist from "../components/Artist";

// Translations
import APIMessages from "../locales/messagesDescriptors/api";

// Define translations
const artistMessages = defineMessages(messagesMap(Array.concat([], APIMessages)));


/**
 * Single artist page.
 */
class ArtistPageIntl extends Component {
    componentWillMount() {
        const id = filterInt(this.props.params.artist.split("-")[0]);
        if (isNaN(id)) {
            // Redirect to homepage
            this.context.router.replace({
                pathname: "/",
            });
        }
        // Load the data
        this.props.actions.loadArtist({
            filter: id,
            include: ["albums", "songs"],
        });
    }

    componentWillUnmount() {
        this.props.actions.decrementRefCount({
            "artist": [this.props.artist.get("id")],
        });
    }

    render() {
        const {formatMessage} = this.props.intl;

        const error = handleErrorI18nObject(this.props.error, formatMessage, artistMessages);

        return (
            <Artist playAction={this.props.actions.playSong} playNextAction={this.props.actions.pushSong} isFetching={this.props.isFetching} error={error} artist={this.props.artist} albums={this.props.albums} songs={this.props.songs} />
        );
    }
}

ArtistPageIntl.propTypes = {
    intl: intlShape.isRequired,
};
ArtistPageIntl.contextTypes = {
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.params.artist.split("-")[0];
    // Get artist
    let artist = state.entities.getIn(["entities", "artist", id]);
    let albums = new Immutable.List();
    let songs = new Immutable.Map();
    if (artist) {
        // Get albums
        let artistAlbums = artist.get("albums");
        if (Immutable.List.isList(artistAlbums)) {
            albums = artistAlbums.map(
                id => state.entities.getIn(["entities", "album", id])
            );
        }
        // Get songs
        let artistSongs = artist.get("songs");
        if (Immutable.List.isList(artistSongs)) {
            songs = state.entities.getIn(["entities", "song"]).filter(
                song => artistSongs.includes(song.get("id"))
            );
        }
    } else {
        artist = new Immutable.Map();
    }
    return {
        isFetching: state.entities.isFetching,
        error: state.entities.error,
        artist: artist,
        albums: albums,
        songs: songs,
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ArtistPageIntl));
