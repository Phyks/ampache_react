import React, { Component, PropTypes } from "react";

export default class FilterBar extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange (e) {
        e.preventDefault();

        this.props.onUserInput(this.refs.filterTextInput.value);
    }

    render () {
        return (
            <div className="filter">
                <p className="col-xs-12 col-sm-6 col-md-4 col-md-offset-1 filter-legend" id="filterInputDescription">What are we listening to today?</p>
                <div className="col-xs-12 col-sm-6 col-md-4 input-group">
                    <form className="form-inline" onSubmit={this.handleChange} aria-describedby="filterInputDescription">
                        <div className="form-group">
                            <input type="text" className="form-control filter-input" placeholder="Filter…" aria-label="Filter…" value={this.props.filterText} onChange={this.handleChange} ref="filterTextInput" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

FilterBar.propTypes = {
    onUserInput: PropTypes.func,
    filterText: PropTypes.string
};
