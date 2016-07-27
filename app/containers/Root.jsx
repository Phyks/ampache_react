import React, { Component, PropTypes } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { IntlProvider } from "react-intl";

import routes from "../routes";

export default class Root extends Component {
    render() {
        const { locale, messages, defaultLocale, store, history } = this.props;
        return (
            <Provider store={store}>
                <IntlProvider locale={locale} messages={messages} defaultLocale={defaultLocale}>
                    <Router history={history} routes={routes} />
                </IntlProvider>
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
};
