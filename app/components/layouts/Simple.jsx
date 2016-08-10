// NPM imports
import React, { Component } from "react";


/**
 * Simple layout, meaning just enclosing children in a div.
 */
export default class SimpleLayout extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
