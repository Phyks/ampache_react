// NPM imports
import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Actions
import * as actionCreators from "../actions";

// Components
import Login from "../components/Login";


/**
 * Login page
 */
export class LoginPage extends Component {
    constructor (props) {
        super(props);

        // Bind this
        this.handleSubmit = this.handleSubmit.bind(this);
        this._getRedirectTo = this._getRedirectTo.bind(this);
    }

    /**
     * Get URL to redirect to based on location props.
     */
    _getRedirectTo() {
        let redirectPathname = "/";
        let redirectQuery = {};
        const { location } = this.props;
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

    componentWillMount () {
        // This checks if the user is already connected or not and redirects
        // them if it is the case.

        // Get next page to redirect to
        const redirectTo = this._getRedirectTo();

        if (this.props.isAuthenticated) {
            // If user is already authenticated, redirects them
            this.context.router.replace(redirectTo);
        } else if (this.props.rememberMe) {
            // Else if remember me is set, try to reconnect them
            this.props.actions.loginUser(
                this.props.username,
                this.props.token,
                this.props.endpoint,
                true,
                redirectTo,
                true
            );
        }
    }

    /**
     * Handle click on submit button.
     */
    handleSubmit (username, password, endpoint, rememberMe) {
        // Get page to redirect to
        const redirectTo = this._getRedirectTo();
        // Trigger login action
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
