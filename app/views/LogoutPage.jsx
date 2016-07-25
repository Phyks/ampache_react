import { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actionCreators from "../actions";

export class LogoutPage extends Component {
    componentDidMount () {
        this.props.actions.logoutAndRedirect();
    }

    render () {
        return (
            null
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(null, mapDispatchToProps)(LogoutPage);
