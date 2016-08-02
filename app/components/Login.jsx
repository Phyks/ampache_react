import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";

import { i18nRecord } from "../models/i18n";
import { messagesMap } from "../utils";
import APIMessages from "../locales/messagesDescriptors/api";
import messages from "../locales/messagesDescriptors/Login";

import css from "../styles/Login.scss";

const loginMessages = defineMessages(messagesMap(Array.concat([], APIMessages, messages)));

class LoginFormCSSIntl extends Component {
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
        if (this.props.isAuthenticating) {
            // Don't handle submit if already logging in
            return;
        }
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
        const {formatMessage} = this.props.intl;
        var infoMessage = this.props.info;
        if (this.props.info && this.props.info instanceof i18nRecord) {
            infoMessage = (
                <FormattedMessage {...loginMessages[this.props.info.id]} values={ this.props.info.values} />
            );
        }
        var errorMessage = this.props.error;
        if (this.props.error && this.props.error instanceof i18nRecord) {
            errorMessage = (
                <FormattedMessage {...loginMessages[this.props.error.id]} values={ this.props.error.values} />
            );
        }
        return (
            <div>
                {
                    this.props.error ?
                        <div className="row">
                            <div className="alert alert-danger" id="loginFormError" role="alert">
                                <p>
                                    <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> { errorMessage }
                                </p>
                            </div>
                        </div>
                        : null
                }
                {
                    this.props.info ?
                        <div className="row">
                            <div className="alert alert-info" id="loginFormInfo" role="alert">
                                <p>{ infoMessage }</p>
                            </div>
                        </div>
                        : null
                }
                <div className="row">
                    <form className="col-sm-9 col-sm-offset-1 col-md-6 col-md-offset-3 text-left form-horizontal login" onSubmit={this.handleSubmit} ref="loginForm" aria-describedby="loginFormInfo loginFormError">
                        <div className="row">
                            <div className="form-group" ref="usernameFormGroup">
                                <div className="col-xs-12">
                                    <input type="text" className="form-control" ref="username" aria-label={formatMessage(loginMessages["app.login.username"])} placeholder={formatMessage(loginMessages["app.login.username"])} autoFocus defaultValue={this.props.username} />
                                </div>
                            </div>
                            <div className="form-group" ref="passwordFormGroup">
                                <div className="col-xs-12">
                                    <input type="password" className="form-control" ref="password" aria-label={formatMessage(loginMessages["app.login.password"])} placeholder={formatMessage(loginMessages["app.login.password"])} />
                                </div>
                            </div>
                            <div className="form-group" ref="endpointFormGroup">
                                <div className="col-xs-12">
                                    <input type="text" className="form-control" ref="endpoint" aria-label={formatMessage(loginMessages["app.login.endpointInputAriaLabel"])} placeholder="http://ampache.example.com" defaultValue={this.props.endpoint} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-xs-12">
                                    <div className="row">
                                        <div className="col-sm-6 col-xs-12 checkbox">
                                            <label id="rememberMeLabel">
                                                <input type="checkbox" ref="rememberMe" defaultChecked={this.props.rememberMe} aria-labelledby="rememberMeLabel" />
                                                <FormattedMessage {...loginMessages["app.login.rememberMe"]} />
                                            </label>
                                        </div>
                                        <div className="col-sm-6 col-xs-12 text-right" styleName="submit">
                                            <input type="submit" className="btn btn-default" aria-label={formatMessage(loginMessages["app.login.signIn"])} defaultValue={formatMessage(loginMessages["app.login.signIn"])} disabled={this.props.isAuthenticating} />
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

LoginFormCSSIntl.propTypes = {
    username: PropTypes.string,
    endpoint: PropTypes.string,
    rememberMe: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(i18nRecord)]),
    info: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(i18nRecord)]),
    intl: intlShape.isRequired,
};

export let LoginForm = injectIntl(CSSModules(LoginFormCSSIntl, css));


class Login extends Component {
    render () {
        const greeting = (
            <p>
                <FormattedMessage {...loginMessages["app.login.greeting"]} />
            </p>
        );
        return (
            <div className="text-center container-fluid">
                <h1><img styleName="titleImage" src="./app/assets/img/ampache-blue.png" alt="A"/>mpache</h1>
                <hr/>
                {(!this.props.error && !this.props.info) ? greeting : null}
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
    info: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default CSSModules(Login, css);
