var path = require("path");
var webpack = require("webpack");

var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var postcssReporter = require("postcss-reporter");
var autoprefixer = require("autoprefixer");
var browsers = ["ie >= 9", "> 1%", "last 3 versions", "not op_mini all"];

module.exports = {
    entry: {
        "index": [
            "babel-polyfill",
            "bootstrap-loader",
            "font-awesome-webpack",
            "./app/styles/common/index.js",
            "./app/utils/common/index.js",
            "./index.js"],
        "fix.ie9": "./fix.ie9.js"
    },

    output: {
        path: path.join(__dirname, "public/"),
        filename: "[name].js",
        publicPath: "./"
    },

    module: {
        loaders: [
            // Handle JS/JSX files
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    "cacheDirectory": ".cache/"
                },
                include: __dirname
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]" +
                    "!postcss-loader"
                )
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]" +
                    "!postcss-loader" +
                    "!sass-loader" +
                    "!sass-resources-loader"
                )
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: "./index.html" },
            { from: "./app/assets" }
        ]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new ExtractTextPlugin("style.css", { allChunks: true })
    ],

    postcss: [autoprefixer({ browsers: browsers }), postcssReporter({ throwError: true, clearMessages: true })],

    sassResources: "./app/styles/variables.scss",

    resolve: {
        // Include empty string "" to resolve files by their explicit extension
        // (e.g. require("./somefile.ext")).
        // Include ".js", ".jsx" to resolve files by these implicit extensions
        // (e.g. require("underscore")).
        extensions: ["", ".js", ".jsx"],

        // Hack for isotope
        alias: {
            "masonry": "masonry-layout",
            "isotope": "isotope-layout"
        },
    }
};
