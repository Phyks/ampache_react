// NPM import
import React, { Component, PropTypes } from "react";
import Immutable from "immutable";

// Other components
import { SongsTable } from "./Songs";

/**
 * An entire album row containing art and tracks table.
 */
export default class Playlist extends Component {
    render() {
        const currentSongSongsTableProps = {
            playAction: this.props.playAction,
            playNextAction: this.props.playNextAction,
            songs: this.props.songs.slice(this.props.currentIndex, this.props.currentIndex + 1),
        };
        const fullPlaylistSongsTableProps = {
            playAction: this.props.playAction,
            playNextAction: this.props.playNextAction,
            songs: this.props.songs,
        };
        return (
            <div className="row">
                <h2>Current song playing</h2>
                <SongsTable {...currentSongSongsTableProps}/>
                <h2>Full playlist</h2>
                <SongsTable {...fullPlaylistSongsTableProps}/>
            </div>
        );
    }
}
Playlist.propTypes = {
    playAction: PropTypes.func.isRequired,
    playNextAction: PropTypes.func.isRequired,
    songs: PropTypes.instanceOf(Immutable.List).isRequired,
    currentIndex: PropTypes.number.isRequired,
};
