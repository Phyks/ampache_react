// NPM imports
import React, { Component } from "react";

// Other views
import ArtistsPage from "./ArtistsPage";


/**
 * Browse page is an alias for artists page at the moment.
 */
export default class BrowsePage extends Component {
    render () {
        return (
            <ArtistsPage {...this.props} />
        );
    }
}
