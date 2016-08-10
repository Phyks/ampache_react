/**
 * This is the main JS entry point in production builds.
 */

// Load the common index
const index = require("./index.all.js");

// Get the rendering function
const render = index.onWindowIntl();

// Perform i18n and render
index.Intl(render);
