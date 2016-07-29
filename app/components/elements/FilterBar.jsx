import React, { Component, PropTypes } from "react";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";

import { messagesMap } from "../../utils";
import messages from "../../locales/messagesDescriptors/elements/FilterBar";

import css from "../../styles/elements/FilterBar.scss";

const filterMessages = defineMessages(messagesMap(messages));

class FilterBarCSSIntl extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

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
                    <form className="form-inline" onSubmit={this.handleChange} aria-describedby="filterInputDescription">
                        <div className="form-group" styleName="form-group">
                            <input type="text" className="form-control" placeholder={formatMessage(filterMessages["app.filter.filter"])} aria-label={formatMessage(filterMessages["app.filter.filter"])} value={this.props.filterText} onChange={this.handleChange} ref="filterTextInput" />
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
