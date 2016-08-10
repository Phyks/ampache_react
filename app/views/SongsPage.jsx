// NPM imports
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import Immutable from "immutable";

// Local imports
import { buildPaginationObject, messagesMap, handleErrorI18nObject } from "../utils";

// Actions
import * as actionCreators from "../actions";

// Components
import Songs from "../components/Songs";

// Translations
import APIMessages from "../locales/messagesDescriptors/api";

// Define translations
const songsMessages = defineMessages(messagesMap(Array.concat([], APIMessages)));


/**
 * Paginated table of available songs
 */
class SongsPageIntl extends Component {
    componentWillMount() {
        // Load the data for current page
        const currentPage = parseInt(this.props.location.query.page) || 1;
        this.props.actions.loadPaginatedSongs({pageNumber: currentPage});
    }

    componentWillReceiveProps(nextProps) {
        // Load the data if page has changed
        const currentPage = parseInt(this.props.location.query.page) || 1;
        const nextPage = parseInt(nextProps.location.query.page) || 1;
        if (currentPage != nextPage) {
            this.props.actions.loadPaginatedSongs({pageNumber: nextPage});
        }
    }

    componentWillUnmount() {
        // Unload data on page change
        this.props.actions.clearPaginatedResults();
    }

    render() {
        const {formatMessage} = this.props.intl;

        const pagination = buildPaginationObject(this.props.location, this.props.currentPage, this.props.nPages, this.props.actions.goToPage);

        const error = handleErrorI18nObject(this.props.error, formatMessage, songsMessages);

        return (
            <Songs playAction={this.props.actions.playSong} isFetching={this.props.isFetching} error={error} songs={this.props.songsList} pagination={pagination} />
        );
    }
}

SongsPageIntl.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
    let songsList = new Immutable.List();
    if (state.paginated.type == "song" && state.paginated.result.size > 0) {
        songsList = state.paginated.result.map(function (id) {
            let song = state.entities.getIn(["entities", "song", id]);
            // Add artist and album infos to song
            const artist = state.entities.getIn(["entities", "artist", song.get("artist")]);
            const album = state.entities.getIn(["entities", "album", song.get("album")]);
            return (
                song
                    .set("artist", new Immutable.Map({id: artist.get("id"), name: artist.get("name")}))
                    .set("album", new Immutable.Map({id: album.get("id"), name: album.get("name")}))
            );
        });
    }
    return {
        isFetching: state.entities.isFetching,
        error: state.entities.error,
        songsList: songsList,
        currentPage: state.paginated.currentPage,
        nPages: state.paginated.nPages,
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SongsPageIntl));
