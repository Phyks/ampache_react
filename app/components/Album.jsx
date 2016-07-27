import React, { Component, PropTypes } from "react";

import { formatLength } from "../utils";

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


export class AlbumTracksTable extends Component {
    render () {
        var rows = [];
        this.props.tracks.forEach(function (item) {
            rows.push(<AlbumTrackRow track={item} key={item.id} />);
        });
        return (
            <table className="table table-hover songs">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}

AlbumTracksTable.propTypes = {
    tracks: PropTypes.array.isRequired
};

export class AlbumRow extends Component {
    render () {
        return (
            <div className="row albumRow">
                <div className="col-sm-offset-2 col-xs-10 albumRowName">
                    <h2>{this.props.album.name}</h2>
                </div>
                <div className="col-xs-2 albumRowArt">
                    <p className="text-center"><img src={this.props.album.art} width="200" height="200" className="img-responsive img-circle art" alt={this.props.album.name} /></p>
                </div>
                <div className="col-sm-10 table-responsive">
                    <AlbumTracksTable tracks={this.props.album.tracks} />
                </div>
            </div>
        );
    }
}

AlbumRow.propTypes = {
    album: PropTypes.object.isRequired
};

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
