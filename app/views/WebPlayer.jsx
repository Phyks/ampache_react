import React, { Component } from "react";
import Immutable from "immutable";

import WebPlayerComponent from "../components/elements/WebPlayer";


export default class WebPlayer extends Component {
    render () {
        const webplayerProps = {
            song: new Immutable.Map({
                art: "http://albumartcollection.com/wp-content/uploads/2011/07/summer-album-art.jpg",
                title: "Tel-ho",
                artist: "Lapso Laps",
            }),
            isPlaying: false,
            isRandom: false,
            isRepeat: true
        };
        return (
            <WebPlayerComponent {...webplayerProps} />
        );
    }
}
