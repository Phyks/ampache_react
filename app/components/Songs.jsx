import React, { Component, PropTypes } from "react";
import { Link} from "react-router";
import CSSModules from "react-css-modules";
import { defineMessages, FormattedMessage } from "react-intl";
import Immutable from "immutable";
import Fuse from "fuse.js";

import FilterBar from "./elements/FilterBar";
import Pagination from "./elements/Pagination";
import { formatLength, messagesMap } from "../utils";

import commonMessages from "../locales/messagesDescriptors/common";
import messages from "../locales/messagesDescriptors/Songs";

import css from "../styles/Songs.scss";

const songsMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));

export class SongsTableRow extends Component {
    render () {
        const length = formatLength(this.props.song.time);
        const linkToArtist = "/artist/" + this.props.song.artist.id;
        const linkToAlbum = "/album/" + this.props.song.album.id;
        return (
            <tr>
                <td>
                    <span className="sr-only">
                        <FormattedMessage {...songsMessages["app.common.play"]} />
                    </span>
                    <span className="glyphicon glyphicon-play-circle" aria-hidden="true"></span>
                </td>
                <td className="title">{this.props.song.name}</td>
                <td className="artist"><Link to={linkToArtist}>{this.props.song.artist.name}</Link></td>
                <td className="album"><Link to={linkToAlbum}>{this.props.song.album.name}</Link></td>
                <td className="genre">{this.props.song.genre}</td>
                <td className="length">{length}</td>
            </tr>
        );
    }
}

SongsTableRow.propTypes = {
    song: PropTypes.object.isRequired
};


class SongsTableCSS extends Component {
    render () {
        var displayedSongs = this.props.songs;
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

        var rows = [];
        displayedSongs.forEach(function (song) {
            rows.push(<SongsTableRow song={song} key={song.id} />);
        });
        var loading = null;
        if (rows.length == 0 && this.props.isFetching) {
            // If we are fetching and there is nothing to show
            loading = (
                <p className="text-center">
                    <FormattedMessage {...songsMessages["app.common.loading"]} />
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
        return (
            <div>
                <FilterBar filterText={this.state.filterText} onUserInput={this.handleUserInput} />
                <SongsTable isFetching={this.props.isFetching} songs={this.props.songs} filterText={this.state.filterText} />
                <Pagination {...this.props.pagination} />
            </div>
        );
    }
}

FilterablePaginatedSongsTable.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    songs: PropTypes.instanceOf(Immutable.List).isRequired,
    pagination: PropTypes.object.isRequired
};
