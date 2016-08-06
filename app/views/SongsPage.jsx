import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import Immutable from "immutable";

import * as actionCreators from "../actions";
import { buildPaginationObject, messagesMap, handleErrorI18nObject } from "../utils";

import Songs from "../components/Songs";

import APIMessages from "../locales/messagesDescriptors/api";

const songsMessages = defineMessages(messagesMap(Array.concat([], APIMessages)));

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
        const pagination = buildPaginationObject(this.props.location, this.props.currentPage, this.props.nPages, this.props.actions.goToPageAction);

        const {formatMessage} = this.props.intl;
        const error = handleErrorI18nObject(this.props.error, formatMessage, songsMessages);
        return (
            <Songs isFetching={this.props.isFetching} error={error} songs={this.props.songsList} pagination={pagination} />
        );
    }
}

SongsPageIntl.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
    let songsList = new Immutable.List();
    if (state.api.result.get("song")) {
        songsList = state.api.result.get("song").map(function (id) {
            let song = state.api.entities.getIn(["track", id]);
            // Add artist and album infos
            const artist = state.api.entities.getIn(["artist", song.get("artist")]);
            const album = state.api.entities.getIn(["album", song.get("album")]);
            song = song.set("artist", new Immutable.Map({id: artist.get("id"), name: artist.get("name")}));
            song = song.set("album", new Immutable.Map({id: album.get("id"), name: album.get("name")}));
            return song;
        });
    }
    return {
        isFetching: state.api.isFetching,
        error: state.api.error,
        artistsList: state.api.entities.get("artist"),
        albumsList: state.api.entities.get("album"),
        songsList: songsList,
        currentPage: state.api.currentPage,
        nPages: state.api.nPages
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SongsPageIntl));
