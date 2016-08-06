import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import Immutable from "immutable";

import * as actionCreators from "../actions";
import { buildPaginationObject, messagesMap, handleErrorI18nObject } from "../utils";

import Albums from "../components/Albums";

import APIMessages from "../locales/messagesDescriptors/api";

const albumsMessages = defineMessages(messagesMap(Array.concat([], APIMessages)));

class AlbumsPageIntl extends Component {
    componentWillMount () {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        // Load the data
        this.props.actions.loadAlbums({pageNumber: currentPage});
    }

    componentWillReceiveProps (nextProps) {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        const nextPage = parseInt(nextProps.location.query.page) || 1;
        if (currentPage != nextPage) {
            // Load the data
            this.props.actions.loadAlbums({pageNumber: nextPage});
        }
    }

    render () {
        const pagination = buildPaginationObject(this.props.location, this.props.currentPage, this.props.nPages, this.props.actions.goToPageAction);

        const {formatMessage} = this.props.intl;
        const error = handleErrorI18nObject(this.props.error, formatMessage, albumsMessages);
        return (
            <Albums isFetching={this.props.isFetching} error={error} albums={this.props.albumsList} pagination={pagination} />
        );
    }
}

AlbumsPageIntl.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
    let albumsList = new Immutable.List();
    let albums = state.api.result.get("album");
    if (albums) {
        albumsList = albums.map(
            id => state.api.entities.getIn(["album", id])
        );
    }
    return {
        isFetching: state.api.isFetching,
        error: state.api.error,
        albumsList: albumsList,
        currentPage: state.api.currentPage,
        nPages: state.api.nPages
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AlbumsPageIntl));
