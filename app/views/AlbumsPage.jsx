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
import Albums from "../components/Albums";

// Translations
import APIMessages from "../locales/messagesDescriptors/api";

// Define translations
const albumsMessages = defineMessages(messagesMap(Array.concat([], APIMessages)));


/**
 * Albums page, grid layout of albums arts.
 */
class AlbumsPageIntl extends Component {
    componentWillMount() {
        // Load the data for current page
        const currentPage = parseInt(this.props.location.query.page) || 1;
        this.props.actions.loadPaginatedAlbums({ pageNumber: currentPage });
    }

    componentWillReceiveProps(nextProps) {
        // Load the data if page has changed
        const currentPage = parseInt(this.props.location.query.page) || 1;
        const nextPage = parseInt(nextProps.location.query.page) || 1;
        if (currentPage != nextPage) {
            // Unload data on page change
            this.props.actions.clearPaginatedResults();
            // Load new data
            this.props.actions.loadPaginatedAlbums({pageNumber: nextPage});
        }
    }

    componentWillUnmount() {
        // Unload data on page change
        this.props.actions.clearPaginatedResults();
    }

    render() {
        const {formatMessage} = this.props.intl;

        const pagination = buildPaginationObject(this.props.location, this.props.currentPage, this.props.nPages, this.props.actions.goToPage);

        const error = handleErrorI18nObject(this.props.error, formatMessage, albumsMessages);

        return (
            <Albums isFetching={this.props.isFetching} error={error} albums={this.props.albumsList} artists={this.props.artistsList} pagination={pagination} />
        );
    }
}

AlbumsPageIntl.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
    let albumsList = new Immutable.List();
    let artistsList = new Immutable.Map();
    if (state.paginated.type == "album" && state.paginated.result.size > 0) {
        albumsList = state.paginated.result.map(
            id => state.entities.getIn(["entities", "album", id])
        );
        albumsList.forEach(function (album) {
            const albumArtist = album.get("artist");  // TODO: get on undefined
            artistsList = artistsList.set(albumArtist, state.entities.getIn(["entities", "artist", albumArtist]));
        });
    }
    return {
        isFetching: state.entities.isFetching,
        error: state.entities.error,
        albumsList: albumsList,
        artistsList: artistsList,
        currentPage: state.paginated.currentPage,
        nPages: state.paginated.nPages,
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AlbumsPageIntl));
