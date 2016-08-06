import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, FormattedMessage } from "react-intl";
import FontAwesome from "react-fontawesome";
import Immutable from "immutable";

import { messagesMap } from "../utils/";

import { AlbumRow } from "./Album";
import DismissibleAlert from "./elements/DismissibleAlert";

import commonMessages from "../locales/messagesDescriptors/common";

import css from "../styles/Artist.scss";

const artistMessages = defineMessages(messagesMap(Array.concat([], commonMessages)));

class ArtistCSS extends Component {
    render () {
        const loading = (
            <div className="row text-center">
                <p>
                    <FontAwesome name="spinner" className="fa-pulse fa-3x fa-fw" aria-hidden="true" />
                    <span className="sr-only"><FormattedMessage {...artistMessages["app.common.loading"]} /></span>
                </p>
            </div>
        );

        if (this.props.isFetching && !this.props.artist) {
            // Loading
            return loading;
        }

        let error = null;
        if (this.props.error) {
            error =  (<DismissibleAlert type="danger" text={this.props.error} />);
        }

        let albumsRows = [];
        const { albums, songs } = this.props;
        const artistAlbums = this.props.artist.get("albums");
        if (albums && songs && artistAlbums && artistAlbums.size > 0) {
            this.props.artist.get("albums").forEach(function (album) {
                album = albums.get(album);
                const albumSongs = album.get("tracks").map(
                    id => songs.get(id)
                );
                albumsRows.push(<AlbumRow album={album} songs={albumSongs} key={album.get("id")} />);
            });
        }
        else {
            // Loading
            albumsRows = loading;
        }
        return (
            <div>
                { error }
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

ArtistCSS.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string,
    artist: PropTypes.instanceOf(Immutable.Map),
    albums: PropTypes.instanceOf(Immutable.Map),
    songs: PropTypes.instanceOf(Immutable.Map)
};

export default CSSModules(ArtistCSS, css);
