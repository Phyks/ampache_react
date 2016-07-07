import React, { Component, PropTypes } from "react";

export default class App extends Component {
    render () {
        return (
            <div>
                {this.props.children && React.cloneElement(this.props.children, {
                    error: this.props.error
                })}
            </div>
        );
    }
}

App.propTypes = {
    // Injected by React Router
    children: PropTypes.node,
};
