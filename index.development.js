import React from "react";
import ReactDOM from "react-dom";

var a11y = require("react-a11y");
a11y(React, { ReactDOM: ReactDOM, includeSrcNode: true });

const index = require("./index.all.js");

var render = index.onWindowIntl();
if (process.env.NODE_ENV !== "production" && module.hot) {
    // Support hot reloading of components
    // and display an overlay for runtime errors
    const renderApp = render;
    const renderError = (error) => {
        const RedBox = require("redbox-react");
        ReactDOM.render(
            <RedBox error={error} />,
            index.rootElement
        );
    };
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
index.Intl(render);
