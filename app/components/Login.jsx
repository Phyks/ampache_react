// NPM imports
import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import FontAwesome from "react-fontawesome";

// Local imports
import { i18nRecord } from "../models/i18n";
import { messagesMap } from "../utils";

// Translations
import APIMessages from "../locales/messagesDescriptors/api";
import messages from "../locales/messagesDescriptors/Login";

// Styles
import css from "../styles/Login.scss";

// Define translations
const loginMessages = defineMessages(messagesMap(Array.concat([], APIMessages, messages)));


/**
 * Login form component
 */
class LoginFormCSSIntl extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);  // bind this to handleSubmit
    }

    /**
     * Set an error on a form element.
     *
     * @param   formGroup   A form element.
     * @param   hasError       Whether or not an error should be set.
     *
     * @return  True if an error is set, false otherwise
     */
    setError(formGroup, hasError) {
        if (hasError) {
            // If error is true, then add error class
            formGroup.classList.add("has-error");
            formGroup.classList.remove("has-success");
            return true;
        }
        // Else, drop it and put success class
        formGroup.classList.remove("has-error");
        formGroup.classList.add("has-success");
        return false;
    }

    /**
     * Form submission handler.
     *
     * @param   e   JS Event.
     */
    handleSubmit(e) {
        e.preventDefault();

        // Don't handle submit if already logging in
        if (this.props.isAuthenticating) {
            return;
        }

        // Get field values
        const username = this.refs.username.value.trim();
        const password = this.refs.password.value.trim();
        const endpoint = this.refs.endpoint.value.trim();
        const rememberMe = this.refs.rememberMe.checked;

        // Check for errors on each field
        let hasError = this.setError(this.refs.usernameFormGroup, !username);
        hasError |= this.setError(this.refs.passwordFormGroup, !password);
        hasError |= this.setError(this.refs.endpointFormGroup, !endpoint);

        if (!hasError) {
            // Submit if no error is found
            this.props.onSubmit(username, password, endpoint, rememberMe);
        }
    }

    componentDidUpdate() {
        if (this.props.error) {
            // On unsuccessful login, set error classes and shake the form
            $(this.refs.loginForm).shake(3, 10, 300);
            this.setError(this.refs.usernameFormGroup, this.props.error);
            this.setError(this.refs.passwordFormGroup, this.props.error);
            this.setError(this.refs.endpointFormGroup, this.props.error);
        }
    }

    render() {
        const {formatMessage} = this.props.intl;

        // Handle info message
        let infoMessage = this.props.info;
        if (this.props.info && this.props.info instanceof i18nRecord) {
            infoMessage = (
                <FormattedMessage {...loginMessages[this.props.info.id]} values={ this.props.info.values} />
            );
        }

        // Handle error message
        let errorMessage = this.props.error;
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
                                    <FontAwesome name="exclamation" aria-hidden="true" /> { errorMessage }
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
                    <form className="col-xs-9 col-xs-offset-1 col-md-6 col-md-offset-3 text-left form-horizontal login" onSubmit={this.handleSubmit} ref="loginForm" aria-describedby="loginFormInfo loginFormError">
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


/**
 * Main login page, including title and login form.
 */
class LoginCSS extends Component {
    render() {
        const greeting = (
            <p>
                <FormattedMessage {...loginMessages["app.login.greeting"]} />
            </p>
        );
        return (
            <div className="text-center container-fluid">
                <h1><img styleName="titleImage" src="./img/ampache-blue.png" alt="A"/>mpache</h1>
                <hr/>
                {(!this.props.error && !this.props.info) ? greeting : null}
                <div className="col-xs-9 col-xs-offset-2 col-md-6 col-md-offset-3">
                    <LoginForm onSubmit={this.props.onSubmit} username={this.props.username} endpoint={this.props.endpoint} rememberMe={this.props.rememberMe} isAuthenticating={this.props.isAuthenticating} error={this.props.error} info={this.props.info} />
                </div>
            </div>
        );
    }
}
LoginCSS.propTypes = {
    username: PropTypes.string,
    endpoint: PropTypes.string,
    rememberMe: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool,
    info: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
export default CSSModules(LoginCSS, css);
