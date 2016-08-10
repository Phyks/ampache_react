// NPM imports
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Actions
import * as actionCreators from "../actions";


/**
 * Logout page
 */
export class LogoutPage extends Component {
    componentWillMount () {
        // Logout when component is mounted
        this.props.actions.logoutAndRedirect();
    }

    render () {
        return (
            <div></div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(null, mapDispatchToProps)(LogoutPage);
