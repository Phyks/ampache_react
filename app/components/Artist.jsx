// NPM imports
import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, FormattedMessage } from "react-intl";
import FontAwesome from "react-fontawesome";
import Immutable from "immutable";

// Local imports
import { messagesMap } from "../utils/";

// Other components
import { AlbumRow } from "./Album";
import DismissibleAlert from "./elements/DismissibleAlert";

// Translations
import commonMessages from "../locales/messagesDescriptors/common";

// Styles
import css from "../styles/Artist.scss";

// Define translations
const artistMessages = defineMessages(messagesMap(Array.concat([], commonMessages)));


/**
 * Single artist page
 */
class ArtistCSS extends Component {
    render () {
        // Define loading message
        let loading = null;
        if (this.props.isFetching) {
            loading = (
                <div className="row text-center">
                    <p>
                        <FontAwesome name="spinner" className="fa-pulse fa-3x fa-fw" aria-hidden="true" />
                        <span className="sr-only"><FormattedMessage {...artistMessages["app.common.loading"]} /></span>
                    </p>
                </div>
            );
        }

        // Handle error
        let error = null;
        if (this.props.error) {
            error =  (<DismissibleAlert type="danger" text={this.props.error} />);
        }

        // Build album rows
        let albumsRows = [];
        const { albums, songs, playAction } = this.props;
        if (albums && songs) {
            albums.forEach(function (album) {
                const albumSongs = album.get("tracks").map(
                    id => songs.get(id)
                );
                albumsRows.push(<AlbumRow playAction={playAction} album={album} songs={albumSongs} key={album.get("id")} />);
            });
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
                { loading }
            </div>
        );
    }
}
ArtistCSS.propTypes = {
    error: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    playAction: PropTypes.func.isRequired,
    artist: PropTypes.instanceOf(Immutable.Map),
    albums: PropTypes.instanceOf(Immutable.List),
    songs: PropTypes.instanceOf(Immutable.Map)
};
export default CSSModules(ArtistCSS, css);
