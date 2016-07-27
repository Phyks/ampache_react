import React, { Component, PropTypes } from "react";

import { AlbumRow } from "./Album";

export default class Artist extends Component {
    render () {
        var albumsRows = [];
        if (Array.isArray(this.props.artist.albums)) {
            this.props.artist.albums.forEach(function (item) {
                albumsRows.push(<AlbumRow album={item} key={item.id} />);
            });
        }
        return (
            <div>
                <div className="row artistNameRow">
                    <div className="col-sm-12">
                        <h1>{this.props.artist.name}</h1>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-9">
                        <p>{this.props.artist.summary}</p>
                    </div>
                    <div className="col-sm-3 text-center">
                        <p><img src={this.props.artist.art} width="200" height="200" className="img-responsive img-circle art" alt={this.props.artist.name}/></p>
                    </div>
                </div>
                { albumsRows }
            </div>
        );
    }
}

Artist.propTypes = {
    artist: PropTypes.object.isRequired
};
