import React, { Component, PropTypes } from "react";
import { IndexLink, Link} from "react-router";
import CSSModules from "react-css-modules";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";

import { messagesMap } from "../../utils";
import commonMessages from "../../locales/messagesDescriptors/common";
import messages from "../../locales/messagesDescriptors/layouts/Sidebar";

import WebPlayer from "../../containers/WebPlayer";

import css from "../../styles/layouts/Sidebar.scss";

const sidebarLayoutMessages = defineMessages(messagesMap(Array.concat([], commonMessages, messages)));

class SidebarLayoutIntl extends Component {
    render () {
        const { formatMessage } = this.props.intl;
        const isActive = {
            discover: (this.props.location.pathname == "/discover") ? "active" : "link",
            browse: (this.props.location.pathname == "/browse") ? "active" : "link",
            artists: (this.props.location.pathname == "/artists") ? "active" : "link",
            albums: (this.props.location.pathname == "/albums") ? "active" : "link",
            songs: (this.props.location.pathname == "/songs") ? "active" : "link",
            search: (this.props.location.pathname == "/search") ? "active" : "link"
        };
        const collapseHamburger = function () {
            $("#main-navbar").collapse("hide");
        };
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12 col-md-1 col-lg-2 sidebar" styleName="sidebar">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-navbar" aria-expanded="false" styleName="toggle">
                            <span className="sr-only">
                                <FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.toggleNavigation"]} />
                            </span>
                            <span className="icon-bar" styleName="icon-bar"></span>
                            <span className="icon-bar" styleName="icon-bar"></span>
                            <span className="icon-bar" styleName="icon-bar"></span>
                        </button>
                        <h1 className="text-center" styleName="title">
                            <IndexLink styleName="link" to="/" styleName="link" onClick={collapseHamburger}>
                                <img alt="A" src="./img/ampache-blue.png" styleName="imgTitle" />
                                <span className="hidden-md">mpache</span>
                            </IndexLink>
                        </h1>
                        <nav className="collapse" styleName="collapse" aria-label={formatMessage(sidebarLayoutMessages["app.sidebarLayout.mainNavigationMenu"])} id="main-navbar" role="navigation">
                            <div className="navbar text-center" styleName="icon-navbar">
                                <div className="container-fluid" styleName="container-fluid">
                                    <ul className="nav navbar-nav" styleName="nav">
                                        <li>
                                            <Link to="/" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.home"])} styleName="link" onClick={collapseHamburger}>
                                                <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                                                <span className="sr-only">
                                                    <FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.home"]} />
                                                </span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/settings" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.settings"])} styleName="link" onClick={collapseHamburger}>
                                                <span className="glyphicon glyphicon-wrench" aria-hidden="true"></span>
                                                <span className="sr-only">
                                                    <FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.settings"]} />
                                                </span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/logout" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.logout"])} styleName="link" onClick={collapseHamburger}>
                                                <span className="glyphicon glyphicon-off" aria-hidden="true"></span>
                                                <span className="sr-only">
                                                    <FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.logout"]} />
                                                </span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <ul className="nav" styleName="nav">
                                <li>
                                    <Link to="/discover" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.discover"])} styleName={isActive.discover} onClick={collapseHamburger}>
                                        <span className="glyphicon glyphicon-globe" aria-hidden="true"></span>
                                        <span className="hidden-md">
                                            &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.discover"]} />
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/browse" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.browse"])} styleName={isActive.browse} onClick={collapseHamburger}>
                                        <span className="glyphicon glyphicon-headphones" aria-hidden="true"></span>
                                        <span className="hidden-md">
                                            &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.browse"]} />
                                        </span>
                                    </Link>
                                    <ul className="nav text-center" styleName="nav-list">
                                        <li>
                                            <Link to="/artists" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.browseArtists"])} styleName={isActive.artists} onClick={collapseHamburger}>
                                                <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
                                                <span className="sr-only text-capitalize">
                                                    <FormattedMessage {...sidebarLayoutMessages["app.common.artist"]} values={{itemCount: 42}} />
                                                </span>
                                                <span className="hidden-md text-capitalize">
                                                    &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.common.artist"]} values={{itemCount: 42}} />
                                                </span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/albums" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.browseAlbums"])} styleName={isActive.albums} onClick={collapseHamburger}>
                                                <span className="glyphicon glyphicon-cd" aria-hidden="true"></span>
                                                <span className="sr-only text-capitalize">
                                                    <FormattedMessage {...sidebarLayoutMessages["app.common.album"]} values={{itemCount: 42}} />
                                                </span>
                                                <span className="hidden-md text-capitalize">
                                                    &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.common.album"]} values={{itemCount: 42}} />
                                                </span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/songs" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.browseSongs"])} styleName={isActive.songs} onClick={collapseHamburger}>
                                                <span className="glyphicon glyphicon-music" aria-hidden="true"></span>
                                                <span className="sr-only text-capitalize">
                                                    <FormattedMessage {...sidebarLayoutMessages["app.common.track"]} values={{itemCount: 42}} />
                                                </span>
                                                <span className="hidden-md text-capitalize">
                                                    &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.common.track"]} values={{itemCount: 42}} />
                                                </span>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link to="/search" title={formatMessage(sidebarLayoutMessages["app.sidebarLayout.search"])} styleName={isActive.search} onClick={collapseHamburger}>
                                        <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                        <span className="hidden-md">
                                            &nbsp;<FormattedMessage {...sidebarLayoutMessages["app.sidebarLayout.search"]} />
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <WebPlayer />
                    </div>
                </div>

                <div className="col-xs-12 col-md-11 col-md-offset-1 col-lg-10 col-lg-offset-2 main-panel" styleName="main-panel" onClick={collapseHamburger} role="main">
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

export default injectIntl(CSSModules(SidebarLayoutIntl, css));
