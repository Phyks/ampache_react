import React, { Component } from "react";

export default class SimpleLayout extends Component {
    render () {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
