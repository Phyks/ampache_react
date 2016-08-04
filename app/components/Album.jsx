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
        const length = formatLength(this.props.track.time);
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
                <td>{this.props.track.track}</td>
                <td>{this.props.track.name}</td>
                <td>{length}</td>
            </tr>
        );
    }
}

AlbumTrackRowCSS.propTypes = {
    track: PropTypes.object.isRequired
};

export let AlbumTrackRow = CSSModules(AlbumTrackRowCSS, css);


class AlbumTracksTableCSS extends Component {
    render () {
        var rows = [];
        this.props.tracks.forEach(function (item) {
            rows.push(<AlbumTrackRow track={item} key={item.id} />);
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
    tracks: PropTypes.array.isRequired
};

export let AlbumTracksTable = CSSModules(AlbumTracksTableCSS, css);

class AlbumRowCSS extends Component {
    render () {
        return (
            <div className="row" styleName="row">
                <div className="col-sm-offset-2 col-xs-9 col-sm-10" styleName="nameRow">
                    <h2>{this.props.album.name}</h2>
                </div>
                <div className="col-xs-3 col-sm-2" styleName="artRow">
                    <p className="text-center"><img src={this.props.album.art} width="200" height="200" className="img-responsive img-circle" styleName="art" alt={this.props.album.name} /></p>
                </div>
                <div className="col-xs-9 col-sm-10 table-responsive">
                    {
                        Array.isArray(this.props.album.tracks) ?
                            <AlbumTracksTable tracks={this.props.album.tracks} /> :
                            null
                    }
                </div>
            </div>
        );
    }
}

AlbumRowCSS.propTypes = {
    album: PropTypes.object.isRequired
};

export let AlbumRow = CSSModules(AlbumRowCSS, css);

export default class Album extends Component {
    render () {
        return (
            <AlbumRow album={this.props.album} />
        );
    }
}

Album.propTypes = {
    album: PropTypes.object.isRequired
};
