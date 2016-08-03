import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";

import * as actionCreators from "../actions";
import { i18nRecord } from "../models/i18n";
import { buildPaginationObject, messagesMap } from "../utils";

import Songs from "../components/Songs";

import APIMessages from "../locales/messagesDescriptors/api";

const songsMessages = defineMessages(messagesMap(APIMessages));

class SongsPageIntl extends Component {
    componentWillMount () {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        // Load the data
        this.props.actions.loadSongs({pageNumber: currentPage});
    }

    componentWillReceiveProps (nextProps) {
        const currentPage = parseInt(this.props.location.query.page) || 1;
        const nextPage = parseInt(nextProps.location.query.page) || 1;
        if (currentPage != nextPage) {
            // Load the data
            this.props.actions.loadSongs({pageNumber: nextPage});
        }
    }

    render () {
        const {formatMessage} = this.props.intl;
        if (this.props.error) {
            var errorMessage = this.props.error;
            if (this.props.error instanceof i18nRecord) {
                errorMessage = formatMessage(songsMessages[this.props.error.id], this.props.error.values);
            }
            alert(errorMessage);
            this.context.router.replace("/");
            return null;
        }
        const pagination = buildPaginationObject(this.props.location, this.props.currentPage, this.props.nPages, this.props.actions.goToPageAction);
        return (
            <Songs isFetching={this.props.isFetching} songs={this.props.songsList} pagination={pagination} />
        );
    }
}

SongsPageIntl.contextTypes = {
    router: PropTypes.object.isRequired
};

SongsPageIntl.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = (state) => ({
    isFetching: state.pagination.songs.isFetching,
    error: state.pagination.songs.error,
    songsList: state.pagination.songs.items,
    currentPage: state.pagination.songs.currentPage,
    nPages: state.pagination.songs.nPages
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SongsPageIntl));
