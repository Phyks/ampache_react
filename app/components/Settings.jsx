// NPM imports
import React, { Component } from "react";
import CSSModules from "react-css-modules";
import { injectIntl, intlShape } from "react-intl";

// Styles
import css from "../styles/Songs.scss";


/**
 * A single row for a single song in the songs table.
 */
class SettingsCSSIntl extends Component {
    render() {
        return (
            <div>
                <h2>Settings</h2>
                <p>TODO</p>
            </div>
        );
    }
}
SettingsCSSIntl.propTypes = {
    intl: intlShape.isRequired,
};
export default injectIntl(CSSModules(SettingsCSSIntl, css));
