import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import FontAwesome from "react-fontawesome";
import Immutable from "immutable";

import { messagesMap } from "../../utils";

import css from "../../styles/elements/WebPlayer.scss";

import commonMessages from "../../locales/messagesDescriptors/common";
import messages from "../../locales/messagesDescriptors/elements/WebPlayer";

const webplayerMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));

class WebPlayerCSSIntl extends Component {
    constructor (props) {
        super(props);

        this.artOpacityHandler = this.artOpacityHandler.bind(this);
    }

    artOpacityHandler (ev) {
        if (ev.type == "mouseover") {
            this.refs.art.style.opacity = "1";
        } else {
            this.refs.art.style.opacity = "0.75";
        }
    }

    render () {
        const { formatMessage } = this.props.intl;

        const playPause = this.props.isPlaying ? "pause" : "play";
        const randomBtnStyles = ["randomBtn"];
        const repeatBtnStyles = ["repeatBtn"];
        if (this.props.isRandom) {
            randomBtnStyles.push("active");
        }
        if (this.props.isRepeat) {
            repeatBtnStyles.push("active");
        }

        return (
            <div id="row" styleName="webplayer">
                <div className="col-xs-12">
                    <div className="row" styleName="artRow" onMouseOver={this.artOpacityHandler} onMouseOut={this.artOpacityHandler}>
                        <div className="col-xs-12">
                            <img src={this.props.song.get("art")} width="200" height="200" alt={formatMessage(webplayerMessages["app.common.art"])} ref="art" styleName="art" />
                            <h2>{this.props.song.get("title")}</h2>
                            <h3>
                                <span className="text-capitalize">
                                    <FormattedMessage {...webplayerMessages["app.webplayer.by"]} />
                                </span> {this.props.song.get("artist")}
                            </h3>
                        </div>
                    </div>

                    <div className="row text-center" styleName="controls">
                        <div className="col-xs-12">
                            <button styleName="prevBtn" aria-label={formatMessage(webplayerMessages["app.webplayer.previous"])} title={formatMessage(webplayerMessages["app.webplayer.previous"])}>
                                <FontAwesome name="step-backward" />
                            </button>
                            <button className="play" styleName="playPauseBtn" aria-label={formatMessage(webplayerMessages["app.common." + playPause])} title={formatMessage(webplayerMessages["app.common." + playPause])}>
                                <FontAwesome name={playPause} />
                            </button>
                            <button styleName="nextBtn" aria-label={formatMessage(webplayerMessages["app.webplayer.next"])} title={formatMessage(webplayerMessages["app.webplayer.next"])}>
                                <FontAwesome name="step-forward" />
                            </button>
                        </div>
                        <div className="col-xs-12">
                            <button styleName="volumeBtn" aria-label={formatMessage(webplayerMessages["app.webplayer.volume"])} title={formatMessage(webplayerMessages["app.webplayer.volume"])}>
                                <FontAwesome name="volume-up" />
                            </button>
                            <button styleName={repeatBtnStyles.join(" ")} aria-label={formatMessage(webplayerMessages["app.webplayer.repeat"])} title={formatMessage(webplayerMessages["app.webplayer.repeat"])} aria-pressed={this.props.isRepeat}>
                                <FontAwesome name="repeat" />
                            </button>
                            <button styleName={randomBtnStyles.join(" ")} aria-label={formatMessage(webplayerMessages["app.webplayer.random"])} title={formatMessage(webplayerMessages["app.webplayer.random"])} aria-pressed={this.props.isRandom}>
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
    song: PropTypes.instanceOf(Immutable.Map).isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isRandom: PropTypes.bool.isRequired,
    isRepeat: PropTypes.bool.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(CSSModules(WebPlayerCSSIntl, css, { allowMultiple: true }));
