// NPM import
import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, FormattedMessage, injectIntl, intlShape } from "react-intl";
import FontAwesome from "react-fontawesome";
import Immutable from "immutable";

// Local imports
import { formatLength, messagesMap } from "../utils";

// Translations
import commonMessages from "../locales/messagesDescriptors/common";

// Styles
import css from "../styles/Album.scss";

// Set translations
const albumMessages = defineMessages(messagesMap(Array.concat([], commonMessages)));


/**
 * Track row in an album tracks table.
 */
class AlbumTrackRowCSSIntl extends Component {
    constructor(props) {
        super(props);

        // Bind this
        this.onPlayClick = this.onPlayClick.bind(this);
        this.onPlayNextClick = this.onPlayNextClick.bind(this);
    }

    /**
     * Handle click on play button.
     */
    onPlayClick() {
        $(this.refs.play).blur();
        this.props.playAction(this.props.track.get("id"));
    }

    /**
     * Handle click on play next button.
     */
    onPlayNextClick() {
        $(this.refs.playNext).blur();
        this.props.playNextAction(this.props.track.get("id"));
    }

    render() {
        const { formatMessage } = this.props.intl;
        const length = formatLength(this.props.track.get("time"));
        return (
            <tr>
                <td>
                    <button styleName="play" title={formatMessage(albumMessages["app.common.play"])} onClick={this.onPlayClick}>
                        <span className="sr-only">
                            <FormattedMessage {...albumMessages["app.common.play"]} />
                        </span>
                        <FontAwesome name="play-circle-o" aria-hidden="true" />
                    </button>&nbsp;
                    <button styleName="playNext" title={formatMessage(albumMessages["app.common.playNext"])} onClick={this.onPlayNextClick} ref="playNext">
                        <span className="sr-only">
                            <FormattedMessage {...albumMessages["app.common.playNext"]} />
                        </span>
                        <FontAwesome name="plus-circle" aria-hidden="true" />
                    </button>
                </td>
                <td>{this.props.track.get("track")}</td>
                <td>{this.props.track.get("name")}</td>
                <td>{length}</td>
            </tr>
        );
    }
}
AlbumTrackRowCSSIntl.propTypes = {
    playAction: PropTypes.func.isRequired,
    playNextAction: PropTypes.func.isRequired,
    track: PropTypes.instanceOf(Immutable.Map).isRequired,
    intl: intlShape.isRequired,
};
export let AlbumTrackRow = injectIntl(CSSModules(AlbumTrackRowCSSIntl, css));


/**
 * Tracks table of an album.
 */
class AlbumTracksTableCSS extends Component {
    render() {
        let rows = [];
        // Build rows for each track
        const { playAction, playNextAction } = this.props;
        this.props.tracks.forEach(function (item) {
            rows.push(<AlbumTrackRow playAction={playAction} playNextAction={playNextAction} track={item} key={item.get("id")} />);
        });
        return (
            <table className="table table-hover" styleName="songs">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}
AlbumTracksTableCSS.propTypes = {
    playAction: PropTypes.func.isRequired,
    playNextAction: PropTypes.func.isRequired,
    tracks: PropTypes.instanceOf(Immutable.List).isRequired,
};
export let AlbumTracksTable = CSSModules(AlbumTracksTableCSS, css);


/**
 * An entire album row containing art and tracks table.
 */
class AlbumRowCSS extends Component {
    render() {
        return (
            <div className="row" styleName="row">
                <div className="col-sm-offset-2 col-xs-9 col-sm-10" styleName="nameRow">
                    <h2>{this.props.album.get("name")}</h2>
                </div>
                <div className="col-xs-3 col-sm-2" styleName="artRow">
                    <p className="text-center"><img src={this.props.album.get("art")} width="200" height="200" className="img-responsive img-circle" styleName="art" alt={this.props.album.get("name")} /></p>
                </div>
                <div className="col-xs-9 col-sm-10 table-responsive">
                    {
                        this.props.songs.size > 0 ?
                            <AlbumTracksTable playAction={this.props.playAction} playNextAction={this.props.playNextAction} tracks={this.props.songs} /> :
                            null
                    }
                </div>
            </div>
        );
    }
}
AlbumRowCSS.propTypes = {
    playAction: PropTypes.func.isRequired,
    playNextAction: PropTypes.func.isRequired,
    album: PropTypes.instanceOf(Immutable.Map).isRequired,
    songs: PropTypes.instanceOf(Immutable.List).isRequired,
};
export let AlbumRow = CSSModules(AlbumRowCSS, css);
