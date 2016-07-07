var webpack = require("webpack");
var config = require("./webpack.config.base.js");

config.devtool = "cheap-module-eval-source-map";

module.exports = config;
