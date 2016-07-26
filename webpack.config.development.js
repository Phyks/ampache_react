var webpack = require("webpack");
var config = require("./webpack.config.base.js");

config.devtool = "cheap-module-eval-source-map";

// necessary for hot reloading with IE:
config.entry.eventsourcePolyfill = 'eventsource-polyfill';
// listen to code updates emitted by hot middleware:
config.entry.webpackHotMiddlewareClient = 'webpack-hot-middleware/client';

config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
]);

module.exports = config;
