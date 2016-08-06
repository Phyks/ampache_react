import React, { Component, PropTypes } from "react";
import { Link} from "react-router";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import FontAwesome from "react-fontawesome";
import Immutable from "immutable";
import Fuse from "fuse.js";

import DismissibleAlert from "./elements/DismissibleAlert";
import FilterBar from "./elements/FilterBar";
import Pagination from "./elements/Pagination";
import { formatLength, messagesMap } from "../utils";

import commonMessages from "../locales/messagesDescriptors/common";
import messages from "../locales/messagesDescriptors/Songs";

import css from "../styles/Songs.scss";

const songsMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));

class SongsTableRowCSSIntl extends Component {
    render () {
        const { formatMessage } = this.props.intl;
        const length = formatLength(this.props.song.get("time"));
        const linkToArtist = "/artist/" + this.props.song.getIn(["artist", "id"]);
        const linkToAlbum = "/album/" + this.props.song.getIn(["album", "id"]);
        return (
            <tr>
                <td>
                    <button styleName="play" title={formatMessage(songsMessages["app.common.play"])} onClick={() => this.props.playAction(this.props.song.get("id"))}>
                        <span className="sr-only">
                            <FormattedMessage {...songsMessages["app.common.play"]} />
                        </span>
                        <FontAwesome name="play-circle-o" aria-hidden="true" />
                    </button>
                </td>
                <td className="title">{this.props.song.get("name")}</td>
                <td className="artist"><Link to={linkToArtist}>{this.props.song.getIn(["artist", "name"])}</Link></td>
                <td className="album"><Link to={linkToAlbum}>{this.props.song.getIn(["album", "name"])}</Link></td>
                <td className="genre">{this.props.song.get("genre")}</td>
                <td className="length">{length}</td>
            </tr>
        );
    }
}

SongsTableRowCSSIntl.propTypes = {
    playAction: PropTypes.func.isRequired,
    song: PropTypes.instanceOf(Immutable.Map).isRequired,
    intl: intlShape.isRequired
};

export let SongsTableRow = injectIntl(CSSModules(SongsTableRowCSSIntl, css));


class SongsTableCSS extends Component {
    render () {
        let displayedSongs = this.props.songs;
        if (this.props.filterText) {
            // Use Fuse for the filter
            displayedSongs = new Fuse(
                this.props.songs.toArray(),
                {
                    "keys": ["name"],
                    "threshold": 0.4,
                    "include": ["score"]
                }).search(this.props.filterText);
            // Keep only items in results
            displayedSongs = displayedSongs.map(function (item) { return item.item; });
        }

        let rows = [];
        const { playAction } = this.props;
        displayedSongs.forEach(function (song) {
            rows.push(<SongsTableRow playAction={playAction} song={song} key={song.get("id")} />);
        });
        let loading = null;
        if (rows.length == 0 && this.props.isFetching) {
            // If we are fetching and there is nothing to show
            loading = (
                <p className="text-center">
                    <FontAwesome name="spinner" className="fa-pulse fa-3x fa-fw" aria-hidden="true" />
                    <span className="sr-only"><FormattedMessage {...songsMessages["app.common.loading"]} /></span>
                </p>
            );
        }
        return (
            <div className="table-responsive">
                <table className="table table-hover" styleName="songs">
                    <thead>
                        <tr>
                            <th></th>
                            <th>
                                <FormattedMessage {...songsMessages["app.songs.title"]} />
                            </th>
                            <th className="text-capitalize">
                                <FormattedMessage {...songsMessages["app.common.artist"]} values={{itemCount: 1}} />
                            </th>
                            <th className="text-capitalize">
                                <FormattedMessage {...songsMessages["app.common.album"]} values={{itemCount: 1}} />
                            </th>
                            <th>
                                <FormattedMessage {...songsMessages["app.songs.genre"]} />
                            </th>
                            <th>
                                <FormattedMessage {...songsMessages["app.songs.length"]} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
                {loading}
            </div>
        );
    }
}

SongsTableCSS.propTypes = {
    playAction: PropTypes.func.isRequired,
    songs: PropTypes.instanceOf(Immutable.List).isRequired,
    filterText: PropTypes.string
};

export let SongsTable = CSSModules(SongsTableCSS, css);


export default class FilterablePaginatedSongsTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            filterText: ""
        };

        this.handleUserInput = this.handleUserInput.bind(this);
    }

    handleUserInput (filterText) {
        this.setState({
            filterText: filterText.trim()
        });
    }

    render () {
        let error = null;
        if (this.props.error) {
            error =  (<DismissibleAlert type="danger" text={this.props.error} />);
        }

        return (
            <div>
                { error }
                <FilterBar filterText={this.state.filterText} onUserInput={this.handleUserInput} />
                <SongsTable playAction={this.props.playAction} isFetching={this.props.isFetching} songs={this.props.songs} filterText={this.state.filterText} />
                <Pagination {...this.props.pagination} />
            </div>
        );
    }
}

FilterablePaginatedSongsTable.propTypes = {
    playAction: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string,
    songs: PropTypes.instanceOf(Immutable.List).isRequired,
    pagination: PropTypes.object.isRequired
};
