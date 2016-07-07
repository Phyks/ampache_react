import React, { Component } from "react";

import ArtistsPage from "./ArtistsPage";

export default class HomePage extends Component {
    render () {
        return (
            <ArtistsPage {...this.props} />
        );
    }
}
