/**
 * This is the main JS entry point in development build.
 */
import React from "react";
import ReactDOM from "react-dom";

// Load react-a11y for accessibility overview
var a11y = require("react-a11y");
a11y(React, { ReactDOM: ReactDOM, includeSrcNode: true });

// Load common index
const index = require("./index.all.js");

// Initial rendering function from common index
var render = index.onWindowIntl();
if (module.hot) {
    // If we support hot reloading of components,
    // display an overlay for runtime errors
    const renderApp = render;
    const renderError = (error) => {
        const RedBox = require("redbox-react").default;
        ReactDOM.render(
            <RedBox error={error} />,
            index.rootElement
        );
    };

    // Try to render, and display an overlay for runtime errors
    render = () => {
        try {
            renderApp();
        } catch (error) {
            console.error(error);
            renderError(error);
        }
    };

    module.hot.accept("./app/containers/Root", () => {
        setTimeout(render);
    });
}

// Perform i18n and render
index.Intl(render);
