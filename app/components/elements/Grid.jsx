import React, { Component, PropTypes } from "react";
import { Link} from "react-router";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import Immutable from "immutable";
import imagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import Fuse from "fuse.js";
import shallowCompare from "react-addons-shallow-compare";

import FilterBar from "./FilterBar";
import Pagination from "./Pagination";
import { immutableDiff, messagesMap } from "../../utils/";

import commonMessages from "../../locales/messagesDescriptors/common";
import messages from "../../locales/messagesDescriptors/grid";

import css from "../../styles/elements/Grid.scss";

const gridMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));

class GridItemCSSIntl extends Component {
    render () {
        const {formatMessage} = this.props.intl;

        var nSubItems = this.props.item[this.props.subItemsType];
        if (Array.isArray(nSubItems)) {
            nSubItems = nSubItems.length;
        }

        var subItemsLabel = formatMessage(gridMessages[this.props.subItemsLabel], { itemCount: nSubItems });

        const to = "/" + this.props.item.type + "/" + this.props.item.id;
        const id = "grid-item-" + this.props.item.type + "/" + this.props.item.id;

        const title = formatMessage(gridMessages["app.grid.goTo" + this.props.item.type.capitalize() + "Page"]);
        return (
            <div className="grid-item col-xs-6 col-sm-3" styleName="placeholders" id={id}>
                <div className="grid-item-content text-center">
                    <Link title={title} to={to}><img src={this.props.item.art} width="200" height="200" className="img-responsive img-circle art" styleName="art" alt={this.props.item.name}/></Link>
                    <h4 className="name" styleName="name">{this.props.item.name}</h4>
                    <span className="sub-items text-muted"><span className="n-sub-items">{nSubItems}</span> <span className="sub-items-type">{subItemsLabel}</span></span>
                </div>
            </div>
        );
    }
}

GridItemCSSIntl.propTypes = {
    item: PropTypes.object.isRequired,
    itemsLabel: PropTypes.string.isRequired,
    subItemsType: PropTypes.string.isRequired,
    subItemsLabel: PropTypes.string.isRequired,
    intl: intlShape.isRequired
};

export let GridItem = injectIntl(CSSModules(GridItemCSSIntl, css));


const ISOTOPE_OPTIONS = {  /** Default options for Isotope grid layout. */
    getSortData: {
        name: ".name",
        nSubitems: ".sub-items .n-sub-items"
    },
    transitionDuration: 0,
    sortBy: "name",
    itemSelector: ".grid-item",
    percentPosition: true,
    layoutMode: "fitRows",
    filter: "*",
    fitRows: {
        gutter: 0
    }
};

export class Grid extends Component {
    constructor (props) {
        super(props);

        // Init grid data member
        this.iso = null;

        this.handleFiltering = this.handleFiltering.bind(this);
    }

    createIsotopeContainer () {
        if (this.iso == null) {
            this.iso = new Isotope(this.refs.grid, ISOTOPE_OPTIONS);
        }
    }

    handleFiltering (props) {
        // If no query provided, drop any filter in use
        if (props.filterText == "") {
            return this.iso.arrange(ISOTOPE_OPTIONS);
        }
        // Use Fuse for the filter
        var result = new Fuse(
            props.items,
            {
                "keys": ["name"],
                "threshold": 0.4,
                "include": ["score"]
            }).search(props.filterText);

        // Apply filter on grid
        this.iso.arrange({
            filter: function (item) {
                var name = $(item).find(".name").text();
                return result.find(function (i) { return i.item.name == name; });
            },
            transitionDuration: "0.4s",
            getSortData: {
                relevance: function (item) {
                    var name = $(item).find(".name").text();
                    return result.reduce(function (p, c) {
                        if (c.item.name == name) {
                            return c.score + p;
                        }
                        return p;
                    }, 0);
                }
            },
            sortBy: "relevance"
        });
        this.iso.updateSortData();
        this.iso.arrange();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filterText !== this.props.filterText) {
            this.handleFiltering(nextProps);
        }
    }

    componentDidMount () {
        // Setup grid
        this.createIsotopeContainer();
        // Only arrange if there are elements to arrange
        const length = this.props.items.length || 0;
        if (length > 0) {
            this.iso.arrange();
        }
    }

    componentDidUpdate(prevProps) {
        // The list of keys seen in the previous render
        let currentKeys = prevProps.items.map(
            (n) => "grid-item-" + n.type + "/" + n.id);

        // The latest list of keys that have been rendered
        let newKeys = this.props.items.map(
            (n) => "grid-item-" + n.type + "/" + n.id);

        // Find which keys are new between the current set of keys and any new children passed to this component
        let addKeys = immutableDiff(newKeys, currentKeys);

        // Find which keys have been removed between the current set of keys and any new children passed to this component
        let removeKeys = immutableDiff(currentKeys, newKeys);

        if (removeKeys.count() > 0) {
            removeKeys.forEach(removeKey => this.iso.remove(document.getElementById(removeKey)));
            this.iso.arrange();
        }
        if (addKeys.count() > 0) {
            const itemsToAdd = addKeys.map((addKey) => document.getElementById(addKey)).toArray();
            this.iso.addItems(itemsToAdd);
            this.iso.arrange();
        }

        var iso = this.iso;
        // Layout again after images are loaded
        imagesLoaded(this.refs.grid).on("progress", function() {
            // Layout after each image load, fix for responsive grid
            if (!iso) {  // Grid could have been destroyed in the meantime
                return;
            }
            iso.layout();
        });
    }

    render () {
        var gridItems = [];
        const itemsLabel = this.props.itemsLabel;
        const subItemsType = this.props.subItemsType;
        const subItemsLabel = this.props.subItemsLabel;
        this.props.items.forEach(function (item) {
            gridItems.push(<GridItem item={item} itemsLabel={itemsLabel} subItemsType={subItemsType} subItemsLabel={subItemsLabel} key={item.id} />);
        });
        var loading = null;
        if (gridItems.length == 0 && this.props.isFetching) {
            loading = (
                <div className="row text-center">
                    <p>
                        <FormattedMessage {...gridMessages["app.common.loading"]} />
                    </p>
                </div>
            );
        }
        return (
            <div>
                { loading }
                <div className="row">
                    <div className="grid" ref="grid">
                        {/* Sizing element */}
                        <div className="grid-sizer col-xs-6 col-sm-3"></div>
                        {/* Other items */}
                        { gridItems }
                    </div>
                </div>
            </div>
        );
    }
}

Grid.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    items: PropTypes.instanceOf(Immutable.List).isRequired,
    itemsLabel: PropTypes.string.isRequired,
    subItemsType: PropTypes.string.isRequired,
    filterText: PropTypes.string
};

export default class FilterablePaginatedGrid extends Component {
    constructor (props) {
        super(props);
        this.state = {
            filterText: ""
        };

        this.handleUserInput = this.handleUserInput.bind(this);
    }

    handleUserInput (filterText) {
        this.setState({
            filterText: filterText.trim()
        });
    }

    render () {
        return (
            <div>
                <FilterBar filterText={this.state.filterText} onUserInput={this.handleUserInput} />
                <Grid filterText={this.state.filterText} {...this.props.grid} />
                <Pagination {...this.props.pagination} />
            </div>
        );
    }
}

FilterablePaginatedGrid.propTypes = {
    grid: PropTypes.object.isRequired,
    pagination: PropTypes.object.isRequired
};
