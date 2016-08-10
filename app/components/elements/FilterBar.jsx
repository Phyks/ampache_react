// NPM imports
import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";

// Local imports
import { messagesMap } from "../../utils";

// Translations
import messages from "../../locales/messagesDescriptors/elements/FilterBar";

// Styles
import css from "../../styles/elements/FilterBar.scss";

// Define translations
const filterMessages = defineMessages(messagesMap(Array.concat([], messages)));


/**
 * Filter bar element with input filter.
 */
class FilterBarCSSIntl extends Component {
    constructor (props) {
        super(props);
        // Bind this on methods
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * Method to handle a change of filter input value.
     *
     * Calls the user input handler passed from parent component.
     *
     * @param   e   A JS event.
     */
    handleChange (e) {
        e.preventDefault();
        this.props.onUserInput(this.refs.filterTextInput.value);
    }

    render () {
        const {formatMessage} = this.props.intl;

        return (
            <div styleName="filter">
                <p className="col-xs-12 col-sm-6 col-md-4 col-md-offset-1" styleName="legend" id="filterInputDescription">
                    <FormattedMessage {...filterMessages["app.filter.whatAreWeListeningToToday"]} />
                </p>
                <div className="col-xs-12 col-sm-6 col-md-4 input-group">
                    <form className="form-inline" onSubmit={this.handleChange} aria-describedby="filterInputDescription" role="search" aria-label={formatMessage(filterMessages["app.filter.filter"])}>
                        <div className="form-group" styleName="form-group">
                            <input type="search" className="form-control" placeholder={formatMessage(filterMessages["app.filter.filter"])} aria-label={formatMessage(filterMessages["app.filter.filter"])} value={this.props.filterText} onChange={this.handleChange} ref="filterTextInput" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
FilterBarCSSIntl.propTypes = {
    onUserInput: PropTypes.func,
    filterText: PropTypes.string,
    intl: intlShape.isRequired
};
export default injectIntl(CSSModules(FilterBarCSSIntl, css));
