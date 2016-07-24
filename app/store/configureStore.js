if (process.env.NODE_ENV === "production") {
    module.exports = require("./configureStore.production.js");
} else {
    module.exports = require("./configureStore.development.js");
}
