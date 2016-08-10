// NPM imports
import React, { Component, PropTypes } from "react";


/**
 * A dismissible Bootstrap alert.
 */
export default class DismissibleAlert extends Component {
    render() {
        // Set correct alert type
        let alertType = "alert-danger";
        if (this.props.type) {
            alertType = "alert-" + this.props.type;
        }

        return (
            <div className={["alert", alertType].join(" ")} role="alert">
                <p>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    {this.props.text}
                </p>
            </div>
        );
    }
}
DismissibleAlert.propTypes = {
    type: PropTypes.string,
    text: PropTypes.string,
};
