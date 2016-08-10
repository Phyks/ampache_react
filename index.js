/**
 * This is the main JS entry point.
 * It loads either the production or the development index file, based on the
 * environment variables in use.
 */
if (process.env.NODE_ENV === "production") {
    module.exports = require("./index.production.js");
} else {
    module.exports = require("./index.development.js");
}
