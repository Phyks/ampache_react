import React from "react";
import ReactDOM from "react-dom";

var a11y = require("react-a11y");
a11y(React, { ReactDOM: ReactDOM, includeSrcNode: true });

require("./index.all.js");
