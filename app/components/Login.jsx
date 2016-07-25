import React, { Component, PropTypes } from "react";

export class LoginForm extends Component {
    constructor (props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setError (formGroup, error) {
        if (error) {
            formGroup.classList.add("has-error");
            formGroup.classList.remove("has-success");
            return true;
        }
        formGroup.classList.remove("has-error");
        formGroup.classList.add("has-success");
        return false;
    }

    handleSubmit (e) {
        e.preventDefault();
        const username = this.refs.username.value.trim();
        const password = this.refs.password.value.trim();
        const endpoint = this.refs.endpoint.value.trim();
        const rememberMe = this.refs.rememberMe.checked;

        var hasError = this.setError(this.refs.usernameFormGroup, !username);
        hasError |= this.setError(this.refs.passwordFormGroup, !password);
        hasError |= this.setError(this.refs.endpointFormGroup, !endpoint);

        if (!hasError) {
            this.props.onSubmit(username, password, endpoint, rememberMe);
        }
    }

    componentDidUpdate () {
        if (this.props.error) {
            $(this.refs.loginForm).shake(3, 10, 300);
            this.setError(this.refs.usernameFormGroup, this.props.error);
            this.setError(this.refs.passwordFormGroup, this.props.error);
            this.setError(this.refs.endpointFormGroup, this.props.error);
        }
    }

    render () {
        return (
            <div>
                {
                    this.props.error ?
                        <div className="row">
                            <div className="alert alert-danger">
                                <span className="glyphicon glyphicon-exclamation-sign"></span> { this.props.error }
                            </div>
                        </div>
                        : null
                }
                {
                    this.props.info ?
                        <div className="row">
                            <div className="alert alert-info">
                                { this.props.info }
                            </div>
                        </div>
                        : null
                }
                <div className="row">
                    <form className="col-sm-9 col-sm-offset-1 col-md-6 col-md-offset-3 text-left form-horizontal login" onSubmit={this.handleSubmit} ref="loginForm">
                        <div className="row">
                            <div className="form-group" ref="usernameFormGroup">
                                <div className="col-xs-12">
                                    <input type="text" className="form-control" ref="username" placeholder="Username" autoFocus defaultValue={this.props.username} />
                                </div>
                            </div>
                            <div className="form-group" ref="passwordFormGroup">
                                <div className="col-xs-12">
                                    <input type="password" className="form-control" ref="password" placeholder="Password" />
                                </div>
                            </div>
                            <div className="form-group" ref="endpointFormGroup">
                                <div className="col-xs-12">
                                    <input type="text" className="form-control" ref="endpoint" placeholder="http://ampache.example.com" defaultValue={this.props.endpoint} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-xs-12">
                                    <div className="row">
                                        <div className="col-sm-6 col-xs-12 checkbox">
                                            <label>
                                                <input type="checkbox" ref="rememberMe" defaultChecked={this.props.rememberMe} /> Remember me
                                            </label>
                                        </div>
                                        <div className="col-sm-6 col-sm-12 submit text-right">
                                            <input type="submit" className="btn btn-default" defaultValue="Sign in" disabled={this.props.isAuthenticating} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

LoginForm.propTypes = {
    username: PropTypes.string,
    endpoint: PropTypes.string,
    rememberMe: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool,
    error: PropTypes.string,
    info: PropTypes.string
};


export default class Login extends Component {
    render () {
        return (
            <div className="login text-center">
                <h1><img src="./app/assets/img/ampache-blue.png" alt="A"/>mpache</h1>
                <hr/>
                <p>Welcome back on Ampache, let"s go!</p>
                <div className="col-sm-9 col-sm-offset-2 col-md-6 col-md-offset-3">
                    <LoginForm onSubmit={this.props.onSubmit} username={this.props.username} endpoint={this.props.endpoint} rememberMe={this.props.rememberMe} isAuthenticating={this.props.isAuthenticating} error={this.props.error} info={this.props.info} />
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    username: PropTypes.string,
    endpoint: PropTypes.string,
    rememberMe: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool,
    error: PropTypes.string,
    info: PropTypes.string
};
