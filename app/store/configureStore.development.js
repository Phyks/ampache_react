import { createStore, applyMiddleware } from "redux";
import { hashHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";

import rootReducer from "../reducers";
import apiMiddleware from "../middleware/api";

const historyMiddleware = routerMiddleware(hashHistory);
const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(thunkMiddleware, apiMiddleware, historyMiddleware, loggerMiddleware)
    );
}
