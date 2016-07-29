var webpack = require("webpack");
var config = require("./webpack.config.base.js");

config.devtool = "cheap-module-eval-source-map";

// necessary for hot reloading with IE:
config.entry.index.splice(1, 0, 'eventsource-polyfill');
// listen to code updates emitted by hot middleware:
config.entry.index.splice(2, 0, 'webpack-hot-middleware/client');

config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
]);

module.exports = config;
