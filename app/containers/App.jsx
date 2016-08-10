/**
 * Main container at the top of our application components tree.
 *
 * Just a div wrapper around children for now.
 */
import React, { Component, PropTypes } from "react";

export default class App extends Component {
    render () {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.node,
};
