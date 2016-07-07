import React, { Component } from "react";

import ArtistsPage from "./ArtistsPage";

export default class BrowsePage extends Component {
    render () {
        return (
            <ArtistsPage {...this.props} />
        );
    }
}
