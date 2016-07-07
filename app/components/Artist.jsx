import React, { Component, PropTypes } from "react";

import { AlbumRow } from "./Album";

// TODO: Songs without associated album

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
                <div className="row">
                    <div className="col-md-9">
                        <h1 className="text-right">{this.props.artist.name}</h1>
                        <hr/>
                        <p>{this.props.artist.summary}</p>
                    </div>
                    <div className="col-md-3">
                        <p><img src={this.props.artist.art} width="200" height="200" className="img-responsive art" alt={this.props.artist.name}/></p>
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
