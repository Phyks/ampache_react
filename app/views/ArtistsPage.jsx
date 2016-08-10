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
import Artists from "../components/Artists";

// Translations
import APIMessages from "../locales/messagesDescriptors/api";

// Define translations
const artistsMessages = defineMessages(messagesMap(Array.concat([], APIMessages)));


/**
 * Grid of artists arts.
 */
class ArtistsPageIntl extends Component {
    componentWillMount() {
        // Load the data for the current page
        const currentPage = parseInt(this.props.location.query.page) || 1;
        this.props.actions.loadPaginatedArtists({pageNumber: currentPage});
    }

    componentWillReceiveProps(nextProps) {
        // Load the data if page has changed
        const currentPage = parseInt(this.props.location.query.page) || 1;
        const nextPage = parseInt(nextProps.location.query.page) || 1;
        if (currentPage != nextPage) {
            // Unload data on page change
            this.props.actions.clearPaginatedResults();
            // Load new data
            this.props.actions.loadPaginatedArtists({pageNumber: nextPage});
        }
    }

    componentWillUnmount() {
        // Unload data on page change
        this.props.actions.clearPaginatedResults();
    }

    render() {
        const {formatMessage} = this.props.intl;

        const pagination = buildPaginationObject(this.props.location, this.props.currentPage, this.props.nPages, this.props.actions.goToPage);

        const error = handleErrorI18nObject(this.props.error, formatMessage, artistsMessages);

        return (
            <Artists isFetching={this.props.isFetching} error={error} artists={this.props.artistsList} pagination={pagination} />
        );
    }
}

ArtistsPageIntl.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
    let artistsList = new Immutable.List();
    if (state.paginated.type == "artist" && state.paginated.result.size > 0) {
        artistsList = state.paginated.result.map(
            id => state.entities.getIn(["entities", "artist", id])
        );
    }
    return {
        isFetching: state.entities.isFetching,
        error: state.entities.error,
        artistsList: artistsList,
        currentPage: state.paginated.currentPage,
        nPages: state.paginated.nPages,
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ArtistsPageIntl));
