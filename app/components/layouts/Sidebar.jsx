import React, { Component, PropTypes } from "react";
import { IndexLink, Link} from "react-router";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";

import { messagesMap } from "../../utils";
import commonMessages from "../../locales/messagesDescriptors/common";
import messages from "../../locales/messagesDescriptors/layouts/Sidebar";

const sidebarLayoutMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));

export default class SidebarLayoutIntl extends Component {
    render () {
        const { formatMessage } = this.props.intl;
        const isActive = {
            discover: (this.props.location.pathname == "/discover") ? "active" : "",
            browse: (this.props.location.pathname == "/browse") ? "active" : "",
            artists: (this.props.location.pathname == "/artists") ? "active" : "",
            albums: (this.props.location.pathname == "/albums") ? "active" : "",
            songs: (this.props.location.pathname == "/songs") ? "active" : "",
            search: (this.props.location.pathname == "/search") ? "active" : ""
        };
        return (
            <div>
                <div className="col-sm-1 col-md-2 sidebar hidden-xs">
                    <h1 className="text-center">
                        <IndexLink to="/">
                            <img alt="A" src="./app/assets/img/ampache-blue.png"/>
                            <span className="hidden-sm">mpache</span>
                        </IndexLink>
                    </h1>
                    <nav aria-label={formatMessage(sidebarLayoutMessages["app.sidebarLayout.mainNavigationMenu"])}>
                        <div className="navbar text-center icon-navbar">
                            <div className="container-fluid">
                                <ul className="nav navbar-nav icon-navbar-nav">
                                    <li>
                                        <Link to="/" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.home"])}>
                                            <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                                            <span className="sr-only">
                                                <FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.home"]} />
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/settings" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.settings"])}>
                                            <span className="glyphicon glyphicon-wrench" aria-hidden="true"></span>
                                            <span className="sr-only">
                                                <FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.settings"]} />
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/logout" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.logout"])}>
                                            <span className="glyphicon glyphicon-off" aria-hidden="true"></span>
                                            <span className="sr-only">
                                                <FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.logout"]} />
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <ul className="nav nav-sidebar">
                            <li>
                                <Link to="/discover" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.discover"])} className={isActive.discover}>
                                    <span className="glyphicon glyphicon-globe" aria-hidden="true"></span>
                                    <span className="hidden-sm">
                                        &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.discover"]} />
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/browse" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.browse"])} className={isActive.browse}>
                                    <span className="glyphicon glyphicon-headphones" aria-hidden="true"></span>
                                    <span className="hidden-sm">
                                        &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.browse"]} />
                                    </span>
                                </Link>
                                <ul className="nav nav-list text-center">
                                    <li>
                                        <Link to="/artists" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.browseArtists"])} className={isActive.artists}>
                                            <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
                                            <span className="sr-only">
                                                <FormattedMessage {...sidebarLayoutMessages["app.common.artist"]} values={{itemCount: 42}} />
                                            </span>
                                            <span className="hidden-sm">
                                                &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.common.artist"]} values={{itemCount: 42}} />
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/albums" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.browseAlbums"])} className={isActive.albums}>
                                            <span className="glyphicon glyphicon-cd" aria-hidden="true"></span>
                                            <span className="sr-only"><FormattedMessage {...sidebarLayoutMessages["app.common.album"]} values={{itemCount: 42}} /></span>
                                            <span className="hidden-sm">
                                                &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.common.album"]} values={{itemCount: 42}} />
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/songs" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.browseSongs"])} className={isActive.songs}>
                                            <span className="glyphicon glyphicon-music" aria-hidden="true"></span>
                                            <span className="sr-only">
                                                <FormattedMessage {...sidebarLayoutMessages["app.common.song"]} values={{itemCount: 42}} />
                                            </span>
                                            <span className="hidden-sm">
                                                &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.common.song"]} values={{itemCount: 42}} />
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/search" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.search"])} className={isActive.search}>
                                    <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                    <span className="hidden-sm">
                                        &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.search"]} />
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="col-sm-11 col-sm-offset-1 col-md-10 col-md-offset-2 main-panel">
                    {this.props.children}
                </div>
            </div>
        );
    }
}


SidebarLayoutIntl.propTypes = {
    children: PropTypes.node,
    intl: intlShape.isRequired
};

export let SidebarLayout = injectIntl(SidebarLayoutIntl);
export default SidebarLayout;
