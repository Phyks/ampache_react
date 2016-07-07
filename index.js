// Export libs used elsewhere
export * from "jquery";

// Handle app init
import React from "react";
import { render } from "react-dom";
import { hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import Root from "./app/containers/Root";
import configureStore from "./app/store/configureStore";

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
    <Root store={store} history={history} />,
    document.getElementById("root")
);
