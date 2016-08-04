import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, FormattedMessage } from "react-intl";
import FontAwesome from "react-fontawesome";

import { formatLength, messagesMap } from "../utils";

import commonMessages from "../locales/messagesDescriptors/common";

import css from "../styles/Album.scss";

const albumMessages = defineMessages(messagesMap(commonMessages));

class AlbumTrackRowCSS extends Component {
    render () {
        const length = formatLength(this.props.track.get("time"));
        return (
            <tr>
                <td>
                    <button styleName="play">
                        <span className="sr-only">
                            <FormattedMessage {...albumMessages["app.common.play"]} />
                        </span>
                        <FontAwesome name="play-circle-o" aria-hidden="true" />
                    </button>
                </td>
                <td>{this.props.track.get("track")}</td>
                <td>{this.props.track.get("name")}</td>
                <td>{length}</td>
            </tr>
        );
    }
}

// TODO: Not object
AlbumTrackRowCSS.propTypes = {
    track: PropTypes.object.isRequired
};

export let AlbumTrackRow = CSSModules(AlbumTrackRowCSS, css);


class AlbumTracksTableCSS extends Component {
    render () {
        let rows = [];
        this.props.tracks.forEach(function (item) {
            rows.push(<AlbumTrackRow track={item} key={item.get("id")} />);
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

// TODO: Not object
AlbumTracksTableCSS.propTypes = {
    tracks: PropTypes.object.isRequired
};

export let AlbumTracksTable = CSSModules(AlbumTracksTableCSS, css);

class AlbumRowCSS extends Component {
    render () {
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
                            <AlbumTracksTable tracks={this.props.songs} /> :
                            null
                    }
                </div>
            </div>
        );
    }
}

// TODO: Not object
AlbumRowCSS.propTypes = {
    album: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired
};

export let AlbumRow = CSSModules(AlbumRowCSS, css);

export default class Album extends Component {
    render () {
        return (
            <AlbumRow album={this.props.album} songs={this.props.songs} />
        );
    }
}

// TODO: Not object
Album.propTypes = {
    album: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired
};
