import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actionCreators from "../actions";

import Login from "../components/Login";

function _getRedirectTo(props) {
    let redirectPathname = "/";
    let redirectQuery = {};
    const { location } = props;
    if (location.state && location.state.nextPathname) {
        redirectPathname = location.state.nextPathname;
    }
    if (location.state && location.state.nextQuery) {
        redirectQuery = location.state.nextQuery;
    }
    return {
        pathname: redirectPathname,
        query: redirectQuery
    };
}

export class LoginPage extends Component {
    componentWillMount () {
        this.checkAuth(this.props);
    }

    checkAuth (propsIn) {
        const redirectTo = _getRedirectTo(propsIn);
        if (propsIn.isAuthenticated) {
            this.context.router.replace(redirectTo);
        } else if (propsIn.rememberMe) {
            this.props.actions.loginUser(propsIn.username, propsIn.token, propsIn.endpoint, true, redirectTo, true);
        }
    }

    constructor (props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (username, password, endpoint, rememberMe) {
        const redirectTo = _getRedirectTo(this.props);
        this.props.actions.loginUser(username, password, endpoint, rememberMe, redirectTo);
    }

    render () {
        return (
            <Login onSubmit={this.handleSubmit} username={this.props.username} endpoint={this.props.endpoint} rememberMe={this.props.rememberMe} isAuthenticating={this.props.isAuthenticating} error={this.props.error} info={this.props.info} />
        );
    }
}

LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    username: state.auth.username,
    endpoint: state.auth.endpoint,
    rememberMe: state.auth.rememberMe,
    isAuthenticating: state.auth.isAuthenticating,
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
    error: state.auth.error,
    info: state.auth.info
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
