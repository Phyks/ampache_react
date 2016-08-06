import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import Immutable from "immutable";

import * as actionCreators from "../actions";
import { buildPaginationObject, messagesMap, handleErrorI18nObject } from "../utils";

import Artists from "../components/Artists";

import APIMessages from "../locales/messagesDescriptors/api";

const artistsMessages = defineMessages(messagesMap(Array.concat([], APIMessages)));

class ArtistsPageIntl extends Component {
    componentWillMount () {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        // Load the data
        this.props.actions.loadArtists({pageNumber: currentPage});
    }

    componentWillReceiveProps (nextProps) {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        const nextPage = parseInt(nextProps.location.query.page) || 1;
        if (currentPage != nextPage) {
            // Load the data
            this.props.actions.loadArtists({pageNumber: nextPage});
        }
    }

    render () {
        const pagination = buildPaginationObject(this.props.location, this.props.currentPage, this.props.nPages, this.props.actions.goToPageAction);

        const {formatMessage} = this.props.intl;
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
    if (state.api.result.get("artist")) {
        artistsList = state.api.result.get("artist").map(
            id => state.api.entities.getIn(["artist", id])
        );
    }
    return {
        isFetching: state.api.isFetching,
        error: state.api.error,
        artistsList: artistsList,
        currentPage: state.api.currentPage,
        nPages: state.api.nPages,
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ArtistsPageIntl));
