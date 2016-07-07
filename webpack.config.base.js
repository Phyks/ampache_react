var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        "index": "./index.js",
        "fix.ie9": "./fix.ie9.js"
    },

    output: {
        path: path.join(__dirname, "app/dist"),
        filename: "[name].js",
        publicPath: "/app/dist/"
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ["babel"],
                include: __dirname
            }
        ]
    },

    plugins: [
    ],

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
        }
    }
};
