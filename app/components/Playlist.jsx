// TODO: Styling
// NPM import
import React, { Component, PropTypes } from "react";
import Immutable from "immutable";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";

// Local imports
import { messagesMap } from "../utils";

// Other components
import { SongsTable } from "./Songs";

// Translations
import commonMessages from "../locales/messagesDescriptors/common";
import messages from "../locales/messagesDescriptors/Playlist";

// Define translations
const playlistMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));


/**
 * An entire album row containing art and tracks table.
 */
class PlaylistIntl extends Component {
    render() {
        let playlistText = null;
        if (this.props.songs.size > 0) {
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
            playlistText = (
                <div>
                    <p className="text-center">
                        <button onClick={() => this.props.flushAction() }>
                            <FormattedMessage {...playlistMessages["app.playlist.flushPlaylist"]} />
                        </button>
                    </p>

                    <h3>
                        <FormattedMessage {...playlistMessages["app.playlist.currentSongPlaying"]} />
                    </h3>
                    <SongsTable {...currentSongSongsTableProps}/>

                    <h3>
                        <FormattedMessage {...playlistMessages["app.playlist.fullPlaylist"]} />
                    </h3>
                    <SongsTable {...fullPlaylistSongsTableProps}/>
                </div>
            );
        } else {
            playlistText = (
                <p>
                    <FormattedMessage {...playlistMessages["app.playlist.emptyPlaylist"]}/>
                </p>
            );
        }
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <h2>
                            <FormattedMessage {...playlistMessages["app.playlist.playlist"]} />
                        </h2>
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        { playlistText }
                    </div>
                </div>
            </div>
        );

    }
}
PlaylistIntl.propTypes = {
    playAction: PropTypes.func.isRequired,
    playNextAction: PropTypes.func,
    flushAction: PropTypes.func.isRequired,
    songs: PropTypes.instanceOf(Immutable.List).isRequired,
    currentIndex: PropTypes.number.isRequired,
    intl: intlShape.isRequired,
};
export default injectIntl(PlaylistIntl);
