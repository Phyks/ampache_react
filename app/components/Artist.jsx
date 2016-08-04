import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";

import { AlbumRow } from "./Album";

import css from "../styles/Artist.scss";

class ArtistCSS extends Component {
    render () {
        let albumsRows = [];
        if (this.props.artist.get("albums").size > 0) {
            const artistAlbums = this.props.albums;
            const artistSongs = this.props.songs;
            this.props.artist.get("albums").forEach(function (album) {
                album = artistAlbums.get(album);
                const songs = album.get("tracks").map(
                    id => artistSongs.get(id)
                );
                albumsRows.push(<AlbumRow album={album} songs={songs} key={album.get("id")} />);
            });
        }
        return (
            <div>
                <div className="row" styleName="name">
                    <div className="col-sm-12">
                        <h1>{this.props.artist.get("name")}</h1>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-9">
                        <p>{this.props.artist.get("summary")}</p>
                    </div>
                    <div className="col-sm-3 text-center">
                        <p><img src={this.props.artist.get("art")} width="200" height="200" className="img-responsive img-circle" styleName="art" alt={this.props.artist.get("name")}/></p>
                    </div>
                </div>
                { albumsRows }
            </div>
        );
    }
}

// TODO: Not object
ArtistCSS.propTypes = {
    artist: PropTypes.object.isRequired,
    albums: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired
};

export default CSSModules(ArtistCSS, css);
