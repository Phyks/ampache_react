// NPM imports
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Howl } from "howler";

// Actions
import * as actionCreators from "../actions";

// Components
import WebPlayerComponent from "../components/elements/WebPlayer";


/**
 * Webplayer container.
 */
class WebPlayer extends Component {
    constructor(props) {
        super(props);

        // Data attributes
        this.howl = null;

        // Bind this
        this.startPlaying = this.startPlaying.bind(this);
    }

    componentDidMount() {
        // Start playback upon component mount
        this.startPlaying(this.props);
    }

    componentWillUpdate(nextProps) {
        // Handle stop
        if (!nextProps.currentSong || nextProps.playlist.size < 1) {
            if (this.howl) {
                this.howl.stop();
            }
        }

        // Toggle play / pause
        if (nextProps.isPlaying != this.props.isPlaying) {
            // This check ensure we do not start playing multiple times the
            // same song
            this.startPlaying(nextProps);
        }

        // If something is playing back
        if (this.howl) {
            // Set mute / unmute
            this.howl.mute(nextProps.isMute);
            // Set volume
            this.howl.volume(nextProps.volume / 100);
        }
    }

    /**
     * Handle playback through Howler and Web Audio API.
     *
     * @params  props   A set of props to use for setting play parameters.
     */
    startPlaying(props) {
        if (props.isPlaying && props.currentSong) {
            // If it should be playing any song
            if (!this.howl) {
                // Build a new Howler object with current song to play
                const url = props.currentSong.get("url");
                this.howl = new Howl({
                    src: [url],
                    html5: true,  // Use HTML5 by default to allow streaming
                    mute: props.isMute,
                    volume: props.volume / 100,  // Set current volume
                    autoplay: false,  // No autoplay, we handle it manually
                });
            } else {
                // Else, something is playing
                // TODO If it is not the expected song, change it
            }
            // Start playing
            this.howl.play();
        }
        else {
            // If it should not be playing
            if (this.howl) {
                // Pause any running music
                this.howl.pause();
            }
        }
    }

    render() {
        const webplayerProps = {
            isPlaying: this.props.isPlaying,
            isRandom: this.props.isRandom,
            isRepeat: this.props.isRepeat,
            isMute: this.props.isMute,
            volume: this.props.volume,
            currentIndex: this.props.currentIndex,
            playlist: this.props.playlist,
            currentSong: this.props.currentSong,
            currentArtist: this.props.currentArtist,
            // Use a lambda to ensure no first argument is passed to
            // togglePlaying
            onPlayPause: (() => this.props.actions.togglePlaying()),
            onPrev: this.props.actions.playPrevious,
            onSkip: this.props.actions.playNext,
            onRandom: this.props.actions.toggleRandom,
            onRepeat: this.props.actions.toggleRepeat,
            onMute: this.props.actions.toggleMute,
        };
        return (
            (this.props.playlist.size > 0)
            ? <WebPlayerComponent {...webplayerProps} />
            : <div></div>
        );
    }
}
const mapStateToProps = (state) => {
    const currentIndex = state.webplayer.currentIndex;
    const playlist = state.webplayer.playlist;

    // Get current song and artist from entities store
    const currentSong = state.entities.getIn(["entities", "song", playlist.get(currentIndex)]);
    let currentArtist = undefined;
    if (currentSong) {
        currentArtist = state.entities.getIn(["entities", "artist", currentSong.get("artist")]);
    }
    return {
        isPlaying: state.webplayer.isPlaying,
        isRandom: state.webplayer.isRandom,
        isRepeat: state.webplayer.isRepeat,
        isMute: state.webplayer.isMute,
        volume: state.webplayer.volume,
        currentIndex: currentIndex,
        playlist: playlist,
        currentSong: currentSong,
        currentArtist: currentArtist,
    };
};
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(WebPlayer);
