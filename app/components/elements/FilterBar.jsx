import React, { Component, PropTypes } from "react";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";

import { messagesMap } from "../../utils";
import messages from "../../locales/messagesDescriptors/elements/FilterBar";

const filterMessages = defineMessages(messagesMap(messages));

class FilterBarIntl extends Component {
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
            <div className="filter">
                <p className="col-xs-12 col-sm-6 col-md-4 col-md-offset-1 filter-legend" id="filterInputDescription">
                    <FormattedMessage {...filterMessages["app.filter.whatAreWeListeningToToday"]} />
                </p>
                <div className="col-xs-12 col-sm-6 col-md-4 input-group">
                    <form className="form-inline" onSubmit={this.handleChange} aria-describedby="filterInputDescription">
                        <div className="form-group">
                            <input type="text" className="form-control filter-input" placeholder={formatMessage(filterMessages["app.filter.filter"])} aria-label={formatMessage(filterMessages["app.filter.filter"])} value={this.props.filterText} onChange={this.handleChange} ref="filterTextInput" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

FilterBarIntl.propTypes = {
    onUserInput: PropTypes.func,
    filterText: PropTypes.string,
    intl: intlShape.isRequired
};

export let FilterBar = injectIntl(FilterBarIntl);
export default FilterBar;
