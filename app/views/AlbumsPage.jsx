import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";

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
            var errorMessage = this.props.error;
            if (this.props.error instanceof i18nRecord) {
                errorMessage = formatMessage(albumsMessages[this.props.error.id], this.props.error.values);
            }
            alert(errorMessage);
            this.context.router.replace("/");
            return null;
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

const mapStateToProps = (state) => ({
    isFetching: state.pagination.albums.isFetching,
    error: state.pagination.albums.error,
    albumsList: state.pagination.albums.items,
    currentPage: state.pagination.albums.currentPage,
    nPages: state.pagination.albums.nPages
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AlbumsPageIntl));
