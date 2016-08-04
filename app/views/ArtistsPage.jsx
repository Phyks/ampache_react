import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import Immutable from "immutable";

import * as actionCreators from "../actions";
import { i18nRecord } from "../models/i18n";
import { buildPaginationObject, messagesMap } from "../utils";

import Artists from "../components/Artists";

import APIMessages from "../locales/messagesDescriptors/api";

const artistsMessages = defineMessages(messagesMap(APIMessages));

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
        const {formatMessage} = this.props.intl;
        if (this.props.error) {
            let errorMessage = this.props.error;
            if (this.props.error instanceof i18nRecord) {
                errorMessage = formatMessage(artistsMessages[this.props.error.id], this.props.error.values);
            }
            alert(errorMessage);
            this.context.router.replace("/");
            return (<div></div>);
        }
        const pagination = buildPaginationObject(this.props.location, this.props.currentPage, this.props.nPages, this.props.actions.goToPageAction);
        return (
            <Artists isFetching={this.props.isFetching} artists={this.props.artistsList} pagination={pagination} />
        );
    }
}

ArtistsPageIntl.contextTypes = {
    router: PropTypes.object.isRequired
};

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
