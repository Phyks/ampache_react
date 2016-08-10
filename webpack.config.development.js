var webpack = require("webpack");
var config = require("./webpack.config.base.js");

// Use cheap source maps
config.devtool = "cheap-module-eval-source-map";

// Necessary for hot reloading with IE:
config.entry.index.splice(1, 0, 'eventsource-polyfill');
// Listen to code updates emitted by hot middleware:
config.entry.index.splice(2, 0, 'webpack-hot-middleware/client');

// Hot reloading stuff
config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
]);

module.exports = config;
