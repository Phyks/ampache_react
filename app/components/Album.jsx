import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";

import { formatLength } from "../utils";

import css from "../styles/Album.scss";

export class AlbumTrackRow extends Component {
    render () {
        const length = formatLength(this.props.track.length);
        return (
            <tr>
                <td>{this.props.track.track}</td>
                <td>{this.props.track.name}</td>
                <td>{length}</td>
            </tr>
        );
    }
}

AlbumTrackRow.propTypes = {
    track: PropTypes.object.isRequired
};


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
                <div className="col-sm-offset-2 col-xs-10" styleName="nameRow">
                    <h2>{this.props.album.name}</h2>
                </div>
                <div className="col-xs-2" styleName="artRow">
                    <p className="text-center"><img src={this.props.album.art} width="200" height="200" className="img-responsive img-circle" styleName="art" alt={this.props.album.name} /></p>
                </div>
                <div className="col-sm-10 table-responsive">
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
