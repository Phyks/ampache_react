// NPM imports
import React, { Component, PropTypes } from "react";
import { Link} from "react-router";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import FontAwesome from "react-fontawesome";
import Immutable from "immutable";
import Fuse from "fuse.js";

// Local imports
import { formatLength, messagesMap } from "../utils";

// Other components
import DismissibleAlert from "./elements/DismissibleAlert";
import FilterBar from "./elements/FilterBar";
import Pagination from "./elements/Pagination";

// Translations
import commonMessages from "../locales/messagesDescriptors/common";
import messages from "../locales/messagesDescriptors/Songs";

// Styles
import css from "../styles/Songs.scss";

// Define translations
const songsMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));


/**
 * A single row for a single song in the songs table.
 */
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


/**
 * The songs table.
 */
class SongsTableCSS extends Component {
    render () {
        // Handle filtering
        let displayedSongs = this.props.songs;
        if (this.props.filterText) {
            // Use Fuse for the filter
            displayedSongs = new Fuse(
                this.props.songs.toJS(),
                {
                    "keys": ["name"],
                    "threshold": 0.4,
                    "include": ["score"]
                }).search(this.props.filterText);
            // Keep only items in results
            displayedSongs = displayedSongs.map(function (item) { return new Immutable.Map(item.item); });
        }

        // Build song rows
        let rows = [];
        const { playAction } = this.props;
        displayedSongs.forEach(function (song) {
            rows.push(<SongsTableRow playAction={playAction} song={song} key={song.get("id")} />);
        });

        // Handle login icon
        let loading = null;
        if (this.props.isFetching) {
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


/**
 * Complete songs table view with filter and pagination
 */
export default class FilterablePaginatedSongsTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            filterText: ""  // Initial state, no filter text
        };

        this.handleUserInput = this.handleUserInput.bind(this);  // Bind this on user input handling
    }

    /**
     * Method called whenever the filter input is changed.
     *
     * Update the state accordingly.
     *
     * @param   filterText  Content of the filter input.
     */
    handleUserInput (filterText) {
        this.setState({
            filterText: filterText
        });
    }

    render () {
        // Handle error
        let error = null;
        if (this.props.error) {
            error =  (<DismissibleAlert type="danger" text={this.props.error} />);
        }

        // Set props
        const filterProps = {
            filterText: this.state.filterText,
            onUserInput: this.handleUserInput
        };
        const songsTableProps = {
            playAction: this.props.playAction,
            isFetching: this.props.isFetching,
            songs: this.props.songs,
            filterText: this.state.filterText
        };

        return (
            <div>
                { error }
                <FilterBar {...filterProps} />
                <SongsTable {...songsTableProps} />
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
