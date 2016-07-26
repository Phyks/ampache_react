// Export
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./app/styles/ampache.css";

// Handle app init
import React from "react";
import ReactDOM from "react-dom";
import { hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import configureStore from "./app/store/configureStore";

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

const rootElement = document.getElementById("root");

let render = () => {
    const Root = require("./app/containers/Root").default;
    ReactDOM.render(
        <Root store={store} history={history} />,
        rootElement
    );
};

if (module.hot) {
    // Support hot reloading of components
    // and display an overlay for runtime errors
    const renderApp = render;
    const renderError = (error) => {
        const RedBox = require("redbox-react");
        ReactDOM.render(
            <RedBox error={error} />,
            rootElement
        );
    };
    render = () => {
        try {
            renderApp();
        } catch (error) {
            renderError(error);
        }
    };
    module.hot.accept("./app/containers/Root", () => {
        setTimeout(render);
    });
}

render();
