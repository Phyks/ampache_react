import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

export class RequireAuthentication extends Component {
    componentWillMount () {
        this.checkAuth(this.props.isAuthenticated);
    }

    componentWillUpdate () {
        this.checkAuth(this.props.isAuthenticated);
    }

    checkAuth (isAuthenticated) {
        if (!isAuthenticated) {
            this.context.router.replace({
                pathname: "/login",
                state: {
                    nextPathname: this.props.location.pathname,
                    nextQuery: this.props.location.query
                }
            });
        }
    }

    render () {
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
    children: PropTypes.node
};

RequireAuthentication.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(RequireAuthentication);
