/**
 * Container wrapping elements neeeding a valid session. Automatically
 * redirects to login form in case such session does not exist.
 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";


export class RequireAuthentication extends Component {
    componentWillMount() {
        // Check authentication on mount
        this.checkAuth(this.props.isAuthenticated);
    }

    componentWillUpdate(newProps) {
        // Check authentication on update
        this.checkAuth(newProps.isAuthenticated);
    }

    /**
     * Handle redirection in case user is not authenticated.
     *
     * @param   isAuthenticated     A boolean stating whether user has a valid
     *                              session or not.
     */
    checkAuth(isAuthenticated) {
        if (!isAuthenticated) {
            // Redirect to login, redirecting to the actual page after login.
            this.context.router.replace({
                pathname: "/login",
                state: {
                    nextPathname: this.props.location.pathname,
                    nextQuery: this.props.location.query,
                },
            });
        }
    }

    render() {
        return (
            <div>
                {this.props.isAuthenticated === true
                    ? this.props.children
                    : null
                }
            </div>
        );
    }
}

RequireAuthentication.propTypes = {
    // Injected by React Router
    children: PropTypes.node,
};

RequireAuthentication.contextTypes = {
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(RequireAuthentication);
