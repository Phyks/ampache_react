// NPM imports
import React, { Component } from "react";

// Other views
import ArtistsPage from "./ArtistsPage";

/**
 * Homepage is an alias for Artists page at the moment.
 */
export default class HomePage extends Component {
    render () {
        return (
            <ArtistsPage {...this.props} />
        );
    }
}
