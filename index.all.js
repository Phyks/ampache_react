// Handle app init
import React from "react";
import ReactDOM from "react-dom";
import { hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

// i18n
import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import fr from "react-intl/locale-data/fr";

import configureStore from "./app/store/configureStore";

import { getBrowserLocale } from "./app/utils";
import rawMessages from "./app/locales";

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

export const rootElement = document.getElementById("root");

// i18n
export const onWindowIntl = () => {
    addLocaleData([...en, ...fr]);
    const locale = getBrowserLocale();  // TODO: Get navigator.languages as array and match
    var strings = rawMessages[locale] ? rawMessages[locale] : rawMessages["en-US"];
    strings = Object.assign(rawMessages["en-US"], strings);

    let render = () => {
        const Root = require("./app/containers/Root").default;
        ReactDOM.render(
            <Root store={store} history={history} locale={locale} defaultLocale="en-US" messages={strings} />,
            rootElement
        );
    };

    return render;
};

export const Intl = (render) => {
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
