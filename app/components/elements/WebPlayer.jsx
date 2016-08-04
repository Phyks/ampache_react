import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";

import css from "../../styles/elements/WebPlayer.scss";

class WebPlayerCSS extends Component {
    componentDidMount () {
        // TODO: Should be in the container mounting WebPlayer
        $(".sidebar").css("bottom", "15vh");
        $(".main-panel").css("margin-bottom", "15vh");
    }

    render () {
        return (
            <div id="row">
                <div id="webplayer" className="col-xs-12" styleName="body">
                    { /* Top Info */ }
                    <div id="title" styleName="title">
                        <span id="track">Foobar</span>
                        <div id="timer" styleName="timer">0:00</div>
                        <div id="duration" styleName="duration">0:00</div>
                    </div>

                    { /* Controls */ }
                    <div styleName="controlsOuter">
                        <div styleName="controlsInner">
                            <div id="loading" styleName="loading"></div>
                            <div id="playBtn" styleName="playBtn"></div>
                            <div id="pauseBtn" styleName="pauseBtn"></div>
                            <div id="prevBtn" styleName="prevBtn"></div>
                            <div id="nextBtn" styleName="nextBtn"></div>
                        </div>
                        <div id="playlistBtn" styleName="playlistBtn"></div>
                        <div id="volumeBtn" styleName="volumeBtn"></div>
                    </div>

                    { /* Progress */ }
                    <div id="waveform" styleName="waveform"></div>
                    <div id="bar" styleName="progressBar"></div>
                    <div id="progress" styleName="progress"></div>

                    { /* Playlist */ }
                    <div id="playlist" styleName="playlist">
                        <div id="list" styleName="list"></div>
                    </div>

                    { /* Volume */ }
                    <div id="volume" styleName="volume-fadeout">
                        <div id="barFull" styleName="barFull"></div>
                        <div id="barEmpty" styleName="barEmpty"></div>
                        <div id="sliderBtn" styleName="sliderBtn"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CSSModules(WebPlayerCSS, css);
