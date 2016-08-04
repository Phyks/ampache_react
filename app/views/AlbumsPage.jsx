import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import Immutable from "immutable";

import * as actionCreators from "../actions";
import { i18nRecord } from "../models/i18n";
import { buildPaginationObject, messagesMap } from "../utils";

import Albums from "../components/Albums";

import APIMessages from "../locales/messagesDescriptors/api";

const albumsMessages = defineMessages(messagesMap(APIMessages));

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
        const {formatMessage} = this.props.intl;
        if (this.props.error) {
            let errorMessage = this.props.error;
            if (this.props.error instanceof i18nRecord) {
                errorMessage = formatMessage(albumsMessages[this.props.error.id], this.props.error.values);
            }
            alert(errorMessage);
            this.context.router.replace("/");
            return (<div></div>);
        }
        const pagination = buildPaginationObject(this.props.location, this.props.currentPage, this.props.nPages, this.props.actions.goToPageAction);
        return (
            <Albums isFetching={this.props.isFetching} albums={this.props.albumsList} pagination={pagination} />
        );
    }
}

AlbumsPageIntl.contextTypes = {
    router: PropTypes.object.isRequired
};

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
