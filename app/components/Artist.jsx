import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";

import { AlbumRow } from "./Album";

import css from "../styles/Artist.scss";

class ArtistCSS extends Component {
    render () {
        var albumsRows = [];
        if (Array.isArray(this.props.artist.albums)) {
            this.props.artist.albums.forEach(function (item) {
                albumsRows.push(<AlbumRow album={item} key={item.id} />);
            });
        }
        return (
            <div>
                <div className="row" styleName="name">
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
                        <p><img src={this.props.artist.art} width="200" height="200" className="img-responsive img-circle" styleName="art" alt={this.props.artist.name}/></p>
                    </div>
                </div>
                { albumsRows }
            </div>
        );
    }
}

ArtistCSS.propTypes = {
    artist: PropTypes.object.isRequired
};

export default CSSModules(ArtistCSS, css);
