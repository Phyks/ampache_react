import React, { Component, PropTypes } from "react";
import { Link} from "react-router";
import imagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import Fuse from "fuse.js";
import _ from "lodash";

import FilterBar from "./FilterBar";
import Pagination from "./Pagination";

export class GridItem extends Component {
    render () {
        var nSubItems = this.props.item[this.props.subItemsType];
        if (Array.isArray(nSubItems)) {
            nSubItems = nSubItems.length;
        }

        // TODO: i18n
        var subItemsLabel = this.props.subItemsType;
        if (nSubItems < 2) {
            subItemsLabel = subItemsLabel.rstrip("s");
        }

        const to = "/" + this.props.itemsType.rstrip("s") + "/" + this.props.item.id;
        const id = "grid-item-" + this.props.item.type + "/" + this.props.item.id;

        // TODO: i18n
        const title = "Go to " + this.props.itemsType.rstrip("s") + " page";
        return (
            <div className="grid-item col-xs-6 col-sm-3 placeholders" id={id}>
                <div className="grid-item-content placeholder text-center">
                    <Link title={title} to={to}><img src={this.props.item.art} width="200" height="200" className="img-responsive img-circle art" alt={this.props.item.name}/></Link>
                    <h4 className="name">{this.props.item.name}</h4>
                    <span className="sub-items text-muted"><span className="n-sub-items">{nSubItems}</span> <span className="sub-items-type">{subItemsLabel}</span></span>
                </div>
            </div>
        );
    }
}

GridItem.propTypes = {
    item: PropTypes.object.isRequired,
    itemsType: PropTypes.string.isRequired,
    subItemsType: PropTypes.string.isRequired
};


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
            filter: function () {
                var name = $(this).find(".name").text();
                return result.find(function (item) { return item.item.name == name; });
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
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.filterText, this.props.filterText)) {
            this.handleFiltering(nextProps);
        }
    }

    componentDidMount () {
        // Setup grid
        this.createIsotopeContainer();
        // Only arrange if there are elements to arrange
        if (_.get(this, "props.items.length", 0) > 0) {
            this.iso.arrange();
        }
    }

    componentDidUpdate(prevProps) {
        // The list of keys seen in the previous render
        let currentKeys = _.map(
            prevProps.items,
            (n) => "grid-item-" + n.type + "/" + n.id);

        // The latest list of keys that have been rendered
        let newKeys = _.map(
            this.props.items,
            (n) => "grid-item-" + n.type + "/" + n.id);

        // Find which keys are new between the current set of keys and any new children passed to this component
        let addKeys = _.difference(newKeys, currentKeys);

        // Find which keys have been removed between the current set of keys and any new children passed to this component
        let removeKeys = _.difference(currentKeys, newKeys);

        if (removeKeys.length > 0) {
            _.each(removeKeys, removeKey => this.iso.remove(document.getElementById(removeKey)));
            this.iso.arrange();
        }
        if (addKeys.length > 0) {
            this.iso.addItems(_.map(addKeys, (addKey) => document.getElementById(addKey)));
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
        const itemsType = this.props.itemsType;
        const subItemsType = this.props.subItemsType;
        this.props.items.forEach(function (item) {
            gridItems.push(<GridItem item={item} itemsType={itemsType} subItemsType={subItemsType} key={item.id} />);
        });
        return (
            <div className="row">
                <div className="grid" ref="grid">
                    {/* Sizing element */}
                    <div className="grid-sizer col-xs-6 col-sm-3"></div>
                    {/* Other items */}
                    { gridItems }
                </div>
            </div>
        );
    }
}

Grid.propTypes = {
    items: PropTypes.array.isRequired,
    itemsType: PropTypes.string.isRequired,
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
        const nPages = Math.ceil(this.props.itemsTotalCount / this.props.itemsPerPage);
        return (
            <div>
                <FilterBar filterText={this.state.filterText} onUserInput={this.handleUserInput} />
                <Grid items={this.props.items} itemsType={this.props.itemsType} subItemsType={this.props.subItemsType} filterText={this.state.filterText} />
                <Pagination nPages={nPages} currentPage={this.props.currentPage} location={this.props.location} />
            </div>
        );
    }
}

FilterablePaginatedGrid.propTypes = {
    items: PropTypes.array.isRequired,
    itemsTotalCount: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    itemsType: PropTypes.string.isRequired,
    subItemsType: PropTypes.string.isRequired
};
