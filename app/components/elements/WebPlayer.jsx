// NPM imports
import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import Immutable from "immutable";
import FontAwesome from "react-fontawesome";

// Local imports
import { messagesMap } from "../../utils";

// Styles
import css from "../../styles/elements/WebPlayer.scss";

// Translations
import commonMessages from "../../locales/messagesDescriptors/common";
import messages from "../../locales/messagesDescriptors/elements/WebPlayer";

// Define translations
const webplayerMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));


/**
 * Webplayer component.
 */
class WebPlayerCSSIntl extends Component {
    constructor(props) {
        super(props);

        // Bind this
        this.artOpacityHandler = this.artOpacityHandler.bind(this);
    }

    /**
     * Handle opacity on album art.
     *
     * Set opacity on mouseover / mouseout.
     *
     * @param   ev      A JS event.
     */
    artOpacityHandler(ev) {
        if (ev.type == "mouseover") {
            // On mouse over, reduce opacity
            this.refs.art.style.opacity = "1";
            this.refs.artText.style.display = "none";
        } else {
            // On mouse out, set opacity back
            this.refs.art.style.opacity = "0.75";
            this.refs.artText.style.display = "block";
        }
    }

    render() {
        const { formatMessage } = this.props.intl;

        // Get current song (eventually undefined)
        const song = this.props.currentSong;

        // Current status (play or pause) for localization
        const playPause = this.props.isPlaying ? "pause" : "play";
        // Volume fontawesome icon
        const volumeIcon = this.props.isMute ? "volume-off" : "volume-up";

        // Get classes for random and repeat buttons
        const randomBtnStyles = ["randomBtn"];
        const repeatBtnStyles = ["repeatBtn"];
        if (this.props.isRandom) {
            randomBtnStyles.push("active");
        }
        if (this.props.isRepeat) {
            repeatBtnStyles.push("active");
        }

        // Check if a song is currently playing
        let art = null;
        let songTitle = null;
        let artistName = null;
        if (song) {
            art = song.get("art");
            songTitle = song.get("title");
            if (this.props.currentArtist) {
                artistName = this.props.currentArtist.get("name");
            }
        }

        // Click handlers
        const onPrev = (function () {
            $(this.refs.prevBtn).blur();
            this.props.onPrev();
        }).bind(this);
        const onPlayPause = (function () {
            $(this.refs.playPauseBtn).blur();
            this.props.onPlayPause();
        }).bind(this);
        const onSkip = (function () {
            $(this.refs.nextBtn).blur();
            this.props.onSkip();
        }).bind(this);
        const onMute = (function () {
            $(this.refs.volumeBtn).blur();
            this.props.onMute();
        }).bind(this);
        const onRepeat = (function () {
            $(this.refs.repeatBtn).blur();
            this.props.onRepeat();
        }).bind(this);
        const onRandom = (function () {
            $(this.refs.randomBtn).blur();
            this.props.onRandom();
        }).bind(this);

        return (
            <div id="row" styleName="webplayer">
                <div className="col-xs-12">
                    <div className="row" styleName="artRow" onMouseOver={this.artOpacityHandler} onMouseOut={this.artOpacityHandler}>
                        <div className="col-xs-12">
                            <img src={art} width="200" height="200" alt={formatMessage(webplayerMessages["app.common.art"])} ref="art" styleName="art" />
                            <div ref="artText">
                                {
                                    (artistName && songTitle)
                                        ? (
                                            <div>
                                                <h2>{songTitle}</h2>
                                                <h3>
                                                    <span className="text-capitalize">
                                                        <FormattedMessage {...webplayerMessages["app.webplayer.by"]} />
                                                    </span> { artistName }
                                                </h3>
                                            </div>
                                            )
                                        : null
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row text-center" styleName="controls">
                        <div className="col-xs-12">
                            <button styleName="prevBtn" aria-label={formatMessage(webplayerMessages["app.webplayer.previous"])} title={formatMessage(webplayerMessages["app.webplayer.previous"])} onClick={onPrev} ref="prevBtn">
                                <FontAwesome name="step-backward" />
                            </button>
                            <button className="play" styleName="playPauseBtn" aria-label={formatMessage(webplayerMessages["app.common." + playPause])} title={formatMessage(webplayerMessages["app.common." + playPause])} onClick={onPlayPause.bind(this)} ref="playPauseBtn">
                                <FontAwesome name={playPause} />
                            </button>
                            <button styleName="nextBtn" aria-label={formatMessage(webplayerMessages["app.webplayer.next"])} title={formatMessage(webplayerMessages["app.webplayer.next"])} onClick={onSkip} ref="nextBtn">
                                <FontAwesome name="step-forward" />
                            </button>
                        </div>
                        <div className="col-xs-12">
                            <button styleName="volumeBtn" aria-label={formatMessage(webplayerMessages["app.webplayer.volume"])} title={formatMessage(webplayerMessages["app.webplayer.volume"])} onClick={onMute} ref="volumeBtn">
                                <FontAwesome name={volumeIcon} />
                            </button>
                            <button styleName={repeatBtnStyles.join(" ")} aria-label={formatMessage(webplayerMessages["app.webplayer.repeat"])} title={formatMessage(webplayerMessages["app.webplayer.repeat"])} aria-pressed={this.props.isRepeat} onClick={onRepeat} ref="repeatBtn">
                                <FontAwesome name="repeat" />
                            </button>
                            <button styleName={randomBtnStyles.join(" ")} aria-label={formatMessage(webplayerMessages["app.webplayer.random"])} title={formatMessage(webplayerMessages["app.webplayer.random"])} aria-pressed={this.props.isRandom} onClick={onRandom} ref="randomBtn">
                                <FontAwesome name="random" />
                            </button>
                            <button styleName="playlistBtn" aria-label={formatMessage(webplayerMessages["app.webplayer.playlist"])} title={formatMessage(webplayerMessages["app.webplayer.playlist"])}>
                                <FontAwesome name="list" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

WebPlayerCSSIntl.propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    isRandom: PropTypes.bool.isRequired,
    isRepeat: PropTypes.bool.isRequired,
    isMute: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
    currentIndex: PropTypes.number.isRequired,
    playlist: PropTypes.instanceOf(Immutable.List).isRequired,
    currentSong: PropTypes.instanceOf(Immutable.Map),
    currentArtist: PropTypes.instanceOf(Immutable.Map),
    onPlayPause: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onSkip: PropTypes.func.isRequired,
    onRandom: PropTypes.func.isRequired,
    onRepeat: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(CSSModules(WebPlayerCSSIntl, css, { allowMultiple: true }));
