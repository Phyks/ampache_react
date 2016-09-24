// NPM imports
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Immutable from "immutable";

// Actions
import * as actionCreators from "../actions";

// Components
import Playlist from "../components/Playlist";


/**
 * Table of songs in the current playlist.
 */
class PlaylistPage extends Component {
    render() {
        const actions = this.props.actions;
        const playAction = function (id) {
            actions.jumpToSong(id);
            actions.togglePlaying(true);
        };
        return (
            <Playlist playAction={playAction} playNextAction={null} flushAction={actions.stopPlayback} songs={this.props.songsList} currentIndex={this.props.currentIndex} />
        );
    }
}
const mapStateToProps = (state) => {
    let songsList = new Immutable.List();
    if (state.webplayer.playlist.size > 0) {
        songsList = state.webplayer.playlist.map(function (id) {
            let song = state.entities.getIn(["entities", "song", id]);
            // Add artist and album infos to song
            const artist = state.entities.getIn(["entities", "artist", song.get("artist")]);
            const album = state.entities.getIn(["entities", "album", song.get("album")]);
            return (
                song
                    .set("artist", new Immutable.Map({id: artist.get("id"), name: artist.get("name")}))
                    .set("album", new Immutable.Map({id: album.get("id"), name: album.get("name")}))
            );
        });
    }
    return {
        songsList: songsList,
        currentIndex: state.webplayer.currentIndex,
    };
};
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);
