// NPM imports
import React, { Component, PropTypes } from "react";
import { Link} from "react-router";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import FontAwesome from "react-fontawesome";
import Immutable from "immutable";
import imagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import Fuse from "fuse.js";
import shallowCompare from "react-addons-shallow-compare";

// Local imports
import { immutableDiff, messagesMap } from "../../utils/";

// Other components
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";

// Translations
import commonMessages from "../../locales/messagesDescriptors/common";
import messages from "../../locales/messagesDescriptors/grid";

// Styles
import css from "../../styles/elements/Grid.scss";

// Define translations
const gridMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));

// Constants
const ISOTOPE_OPTIONS = {  /** Default options for Isotope grid layout. */
    getSortData: {
        name: ".name",
        nSubitems: ".sub-items .n-sub-items",
    },
    transitionDuration: 0,
    sortBy: "name",
    itemSelector: ".grid-item",
    percentPosition: true,
    layoutMode: "fitRows",
    filter: "*",
    fitRows: {
        gutter: 0,
    },
};


/**
 * A single item in the grid, art + text under the art.
 */
class GridItemCSSIntl extends Component {
    render() {
        const {formatMessage} = this.props.intl;

        // Get number of sub-items
        let nSubItems = this.props.item.get(this.props.subItemsType);
        if (Immutable.List.isList(nSubItems)) {
            nSubItems = nSubItems.size;
        }

        // Define correct sub-items label (plural)
        let subItemsLabel = formatMessage(
            gridMessages[this.props.subItemsLabel],
            { itemCount: nSubItems }
        );

        let to = "/" + this.props.itemsType + "/" + this.props.item.get("id");
        if (this.props.buildLinkTo) {
            to = this.props.buildLinkTo(this.props.itemsType, this.props.item);
        }
        const id = "grid-item-" + this.props.itemsType + "/" + this.props.item.get("id");
        const title = formatMessage(gridMessages["app.grid.goTo" + this.props.itemsType.capitalize() + "Page"]);

        return (
            <div className="grid-item col-xs-6 col-sm-3" styleName="placeholders" id={id}>
                <div className="grid-item-content text-center">
                    <Link title={title} to={to}><img src={this.props.item.get("art")} width="200" height="200" className="img-responsive img-circle art" styleName="art" alt={this.props.item.get("name")}/></Link>
                    <h4 className="name" styleName="name">{this.props.item.get("name")}</h4>
                    <span className="sub-items text-muted"><span className="n-sub-items">{nSubItems}</span> <span className="sub-items-type">{subItemsLabel}</span></span>
                </div>
            </div>
        );
    }
}
GridItemCSSIntl.propTypes = {
    item: PropTypes.instanceOf(Immutable.Map).isRequired,
    itemsType: PropTypes.string.isRequired,
    itemsLabel: PropTypes.string.isRequired,
    subItemsType: PropTypes.string.isRequired,
    subItemsLabel: PropTypes.string.isRequired,
    buildLinkTo: PropTypes.func,
    intl: intlShape.isRequired,
};
export let GridItem = injectIntl(CSSModules(GridItemCSSIntl, css));


/**
 * A grid, formatted using Isotope.JS
 */
export class Grid extends Component {
    constructor(props) {
        super(props);

        // Init grid data member
        this.iso = null;

        // Bind this
        this.createIsotopeContainer = this.createIsotopeContainer.bind(this);
        this.handleFiltering = this.handleFiltering.bind(this);
    }

    /**
     * Create an isotope container if none already exist.
     */
    createIsotopeContainer() {
        if (this.iso == null) {
            this.iso = new Isotope(this.refs.grid, ISOTOPE_OPTIONS);
        }
    }

    /**
     * Handle filtering on the grid.
     */
    handleFiltering(props) {
        // If no query provided, drop any filter in use
        if (props.filterText == "") {
            return this.iso.arrange(ISOTOPE_OPTIONS);
        }

        // Use Fuse for the filter
        let result = new Fuse(
            props.items.toJS(),
            {
                "keys": ["name"],
                "threshold": 0.4,
                "include": ["score"],
            }
        ).search(props.filterText);

        // Apply filter on grid
        this.iso.arrange({
            filter: function (item) {
                let name = $(item).find(".name").text();
                return result.find(function (i) { return i.item.name == name; });
            },
            transitionDuration: "0.4s",
            getSortData: {
                relevance: function (item) {
                    let name = $(item).find(".name").text();
                    return result.reduce(function (p, c) {
                        if (c.item.name == name) {
                            return c.score + p;
                        }
                        return p;
                    }, 0);
                },
            },
            sortBy: "relevance",
        });
        this.iso.updateSortData();
        this.iso.arrange();
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Shallow comparison, render is pure
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillReceiveProps(nextProps) {
        // Handle filtering if filterText is changed
        if (nextProps.filterText !== this.props.filterText) {
            this.handleFiltering(nextProps);
        }
    }

    componentDidMount() {
        // Setup grid
        this.createIsotopeContainer();
        // Only arrange if there are elements to arrange
        if (this.props.items.size > 0) {
            this.iso.arrange();
        }
    }

    componentDidUpdate(prevProps) {
        // The list of keys seen in the previous render
        let currentKeys = prevProps.items.map(
            (n) => "grid-item-" + prevProps.itemsType + "/" + n.get("id")
        );

        // The latest list of keys that have been rendered
        const {itemsType} = this.props;
        let newKeys = this.props.items.map(
            (n) => "grid-item-" + itemsType + "/" + n.get("id")
        );

        // Find which keys are new between the current set of keys and any new
        // children passed to this component
        let addKeys = immutableDiff(newKeys, currentKeys);

        // Find which keys have been removed between the current set of keys
        // and any new children passed to this component
        let removeKeys = immutableDiff(currentKeys, newKeys);

        let iso = this.iso;
        // Remove removed items
        if (removeKeys.size > 0) {
            removeKeys.forEach(removeKey => iso.remove(document.getElementById(removeKey)));
            iso.arrange();
        }
        // Add new items
        if (addKeys.size > 0) {
            const itemsToAdd = addKeys.map((addKey) => document.getElementById(addKey)).toArray();
            iso.addItems(itemsToAdd);
            iso.arrange();
        }

        // Layout again after images are loaded
        imagesLoaded(this.refs.grid).on("progress", function () {
            // Layout after each image load, fix for responsive grid
            if (!iso) {  // Grid could have been destroyed in the meantime
                return;
            }
            iso.layout();
        });
    }

    render() {
        // Handle loading
        let loading = null;
        if (this.props.isFetching) {
            loading = (
                <div className="row text-center">
                    <p>
                        <FontAwesome name="spinner" className="fa-pulse fa-3x fa-fw" aria-hidden="true" />
                        <span className="sr-only"><FormattedMessage {...gridMessages["app.common.loading"]} /></span>
                    </p>
                </div>
            );
        }

        // Build grid items
        let gridItems = [];
        const { itemsType, itemsLabel, subItemsType, subItemsLabel, buildLinkTo } = this.props;
        this.props.items.forEach(function (item) {
            gridItems.push(<GridItem item={item} itemsType={itemsType} itemsLabel={itemsLabel} subItemsType={subItemsType} subItemsLabel={subItemsLabel} buildLinkTo={buildLinkTo} key={item.get("id")} />);
        });

        return (
            <div>
                <div className="row">
                    <div className="grid" ref="grid">
                        {/* Sizing element */}
                        <div className="grid-sizer col-xs-6 col-sm-3"></div>
                        {/* Other items */}
                        { gridItems }
                    </div>
                </div>
                { loading }
            </div>
        );
    }
}
Grid.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    items: PropTypes.instanceOf(Immutable.List).isRequired,
    itemsType: PropTypes.string.isRequired,
    itemsLabel: PropTypes.string.isRequired,
    subItemsType: PropTypes.string.isRequired,
    subItemsLabel: PropTypes.string.isRequired,
    buildLinkTo: PropTypes.func,
    filterText: PropTypes.string,
};


/**
 * Full grid with pagination and filtering input.
 */
export default class FilterablePaginatedGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterText: "",  // No filterText at init
        };

        // Bind this
        this.handleUserInput = this.handleUserInput.bind(this);
    }

    /**
     * Method called whenever the filter input is changed.
     *
     * Update the state accordingly.
     *
     * @param   filterText  Content of the filter input.
     */
    handleUserInput(filterText) {
        this.setState({
            filterText: filterText,
        });
    }

    render() {
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
    pagination: PropTypes.object.isRequired,
};
