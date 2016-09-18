// NPM imports
import React, { Component } from "react";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";

// Local imports
import { messagesMap } from "../utils";

// Translations
import commonMessages from "../locales/messagesDescriptors/common";
import messages from "../locales/messagesDescriptors/Settings";

// Define translations
const settingsMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));


/**
 * A single row for a single song in the songs table.
 */
class SettingsIntl extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <h2>
                            <FormattedMessage {...settingsMessages["app.settings.settings"]} />
                        </h2>
                        <hr/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <p>TODO</p>
                    </div>
                </div>
            </div>
        );
    }
}
SettingsIntl.propTypes = {
    intl: intlShape.isRequired,
};
export default injectIntl(SettingsIntl);
