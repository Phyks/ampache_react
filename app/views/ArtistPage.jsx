import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actionCreators from "../actions";

import Artist from "../components/Artist";

export class ArtistPage extends Component {
    componentWillMount () {
        // Load the data
        this.props.actions.loadArtists({
            pageNumber: 1,
            filter: this.props.params.id,
            include: ["albums", "songs"]
        });
    }

    render () {
        const artist = this.props.artists.find(
            item => item.id == this.props.params.id
        );
        if (artist) {
            return (
                <Artist artist={artist} />
            );
        }
        return null;  // Loading
    }
}

const mapStateToProps = (state) => ({
    artists: state.pagination.artists.items
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistPage);
