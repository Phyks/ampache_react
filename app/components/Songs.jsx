import React, { Component, PropTypes } from "react";
import { Link} from "react-router";
import Fuse from "fuse.js";

import FilterBar from "./elements/FilterBar";
import Pagination from "./elements/Pagination";
import { formatLength} from "../utils";

export class SongsTableRow extends Component {
    render () {
        const length = formatLength(this.props.song.length);
        const linkToArtist = "/artist/" + this.props.song.artist.id;
        const linkToAlbum = "/album/" + this.props.song.album.id;
        return (
            <tr>
                <td></td>
                <td className="title">{this.props.song.name}</td>
                <td className="artist"><Link to={linkToArtist}>{this.props.song.artist.name}</Link></td>
                <td className="artist"><Link to={linkToAlbum}>{this.props.song.album.name}</Link></td>
                <td className="genre">{this.props.song.genre}</td>
                <td className="length">{length}</td>
            </tr>
        );
    }
}

SongsTableRow.propTypes = {
    song: PropTypes.object.isRequired
};


export class SongsTable extends Component {
    render () {
        var displayedSongs = this.props.songs;
        if (this.props.filterText) {
            // Use Fuse for the filter
            displayedSongs = new Fuse(
                this.props.songs,
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
        return (
            <table className="table table-hover songs">
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Genre</th>
                        <th>Length</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

SongsTable.propTypes = {
    songs: PropTypes.array.isRequired,
    filterText: PropTypes.string
};


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
        const nPages = Math.ceil(this.props.songsTotalCount / this.props.songsPerPage);
        return (
            <div>
                <FilterBar filterText={this.state.filterText} onUserInput={this.handleUserInput} />
                <SongsTable songs={this.props.songs} filterText={this.state.filterText} />
                <Pagination nPages={nPages} currentPage={this.props.currentPage} location={this.props.location} />
            </div>
        );
    }
}

FilterablePaginatedSongsTable.propTypes = {
    songs: PropTypes.array.isRequired,
    songsTotalCount: PropTypes.number.isRequired,
    songsPerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired
};
