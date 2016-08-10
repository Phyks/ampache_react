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
            // Add global style hacks
            "./app/common/styles/index.js",
            // Add utils in entry for prototypes modification
            "./app/common/utils/index.js",
            // Main entry point
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
            // Handle CSS files
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]" +
                    "!postcss-loader"
                )
            },
            // Handle SASS files
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
            // Fonts
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
            // SVG
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            }
        ]
    },

    plugins: [
        // Copy some useful files to the output path
        new CopyWebpackPlugin([
            { from: "./index.html" },
            { from: "./favicon.ico" },
            { from: "./app/assets" },
            { from: "./app/vendor" }
        ]),
        // Provide jQuery
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        // Extract CSS
        new ExtractTextPlugin("style.css", { allChunks: true })
    ],

    // PostCSS config
    postcss: [
        autoprefixer({ browsers: browsers }),
        postcssReporter({ throwError: true, clearMessages: true })
    ],

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
