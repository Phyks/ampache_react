// TODO: This file is not finished
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Howl } from "howler";
import Immutable from "immutable";

import * as actionCreators from "../actions";

import WebPlayerComponent from "../components/elements/WebPlayer";

class WebPlayer extends Component {
    constructor (props) {
        super(props);

        this.play = this.play.bind(this);

        this.howl = null;
    }

    componentDidMount () {
        this.play(this.props.isPlaying);
    }

    componentWillUpdate (nextProps) {
        // Toggle play / pause
        if (nextProps.isPlaying != this.props.isPlaying) {
            // This check ensure we do not start multiple times the same music.
            this.play(nextProps);
        }

        // Toggle mute / unmute
        if (this.howl) {
            this.howl.mute(nextProps.isMute);
        }
    }

    getCurrentTrackPath (props) {
        return [
            "tracks",
            props.playlist.get(props.currentIndex)
        ];
    }

    play (props) {
        if (props.isPlaying) {
            if (!this.howl) {
                const url = props.entities.getIn(
                    Array.concat([], this.getCurrentTrackPath(props), ["url"])
                );
                if (!url) {
                    // TODO: Error handling
                    return;
                }
                this.howl = new Howl({
                    src: [url],
                    html5: true,
                    loop: false,
                    mute: props.isMute,
                    autoplay: false,
                });
            }
            this.howl.play();
        }
        else {
            if (this.howl) {
                this.howl.pause();
            }
        }
    }

    render () {
        const currentTrack = this.props.entities.getIn(this.getCurrentTrackPath(this.props));
        let currentArtist = new Immutable.Map();
        if (currentTrack) {
            currentArtist = this.props.entities.getIn(["artists", currentTrack.get("artist")]);
        }

        const webplayerProps = {
            isPlaying: this.props.isPlaying,
            isRandom: this.props.isRandom,
            isRepeat: this.props.isRepeat,
            isMute: this.props.isMute,
            currentTrack: currentTrack,
            currentArtist: currentArtist,
            onPlayPause: (() => this.props.actions.togglePlaying()),
            onPrev: this.props.actions.playPrevious,
            onSkip: this.props.actions.playNext,
            onRandom: this.props.actions.toggleRandom,
            onRepeat: this.props.actions.toggleRepeat,
            onMute: this.props.actions.toggleMute
        };
        return (
            <WebPlayerComponent {...webplayerProps} />
        );
    }
}

const mapStateToProps = (state) => ({
    isPlaying: state.webplayer.isPlaying,
    isRandom: state.webplayer.isRandom,
    isRepeat: state.webplayer.isRepeat,
    isMute: state.webplayer.isMute,
    currentIndex: state.webplayer.currentIndex,
    playlist: state.webplayer.playlist
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(WebPlayer);
