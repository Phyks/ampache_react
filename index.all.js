/**
 * Main JS entry point for all the builds.
 *
 * Performs i18n and initial render.
 */
// React stuff
import React from "react";
import ReactDOM from "react-dom";
import { applyRouterMiddleware, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import useScroll from "react-router-scroll";

// Store
import configureStore from "./app/store/configureStore";

// i18n stuff
import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import fr from "react-intl/locale-data/fr";

import { getBrowserLocales } from "./app/utils";
import rawMessages from "./app/locales";

// Init store and history
const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

// Get root element
export const rootElement = document.getElementById("root");

/**
 * Main function to be called once window.Intl has been populated.
 *
 * Populates the locales messages and perform render.
 */
export function onWindowIntl () {
    // Add locales we support
    addLocaleData([...en, ...fr]);

    // Fetch current preferred locales from the browser
    const locales = getBrowserLocales();

    var locale = "en-US";  // Safe default
    // Populate strings with best matching locale
    var strings = {};
    for (var i = 0; i < locales.length; ++i) {
        if (rawMessages[locales[i]]) {
            locale = locales[i];
            strings = rawMessages[locale];
            break;  // Break at first matching locale
        }
    }
    // Overload strings with default English translation, in case of missing translations
    strings = Object.assign(rawMessages["en-US"], strings);

    // Dynamically set html lang attribute
    document.documentElement.lang = locale;

    // Return a rendering function
    return () => {
        const Root = require("./app/containers/Root").default;
        ReactDOM.render(
            <Root store={store} history={history} render={applyRouterMiddleware(useScroll())} locale={locale} defaultLocale="en-US" messages={strings} />,
            rootElement
        );
    };
};

/**
 * Ensure window.Intl exists, or polyfill it.
 *
 * @param   render    Initial rendering function.
 */
export function Intl (render) {
    if (!window.Intl) {
        require.ensure([
            "intl",
            "intl/locale-data/jsonp/en.js",
            "intl/locale-data/jsonp/fr.js"
        ], function (require) {
            require("intl");
            require("intl/locale-data/jsonp/en.js");
            require("intl/locale-data/jsonp/fr.js");
            render();
        });
    } else {
        render();
    }
};
