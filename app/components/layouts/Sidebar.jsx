import React, { Component } from "react";
import { IndexLink, Link} from "react-router";

export default class SidebarLayout extends Component {
    render () {
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
                    <nav aria-label="Main navigation menu">
                        <div className="navbar text-center icon-navbar">
                            <div className="container-fluid">
                                <ul className="nav navbar-nav icon-navbar-nav">
                                    <li>
                                        <Link to="/" title="Home">
                                            <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                                            <span className="sr-only">Home</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/settings" title="Settings">
                                            <span className="glyphicon glyphicon-wrench" aria-hidden="true"></span>
                                            <span className="sr-only">Settings</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/logout" title="Logout">
                                            <span className="glyphicon glyphicon-off" aria-hidden="true"></span>
                                            <span className="sr-only">Logout</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <ul className="nav nav-sidebar">
                            <li>
                                <Link to="/discover" title="Discover" className={isActive.discover}>
                                    <span className="glyphicon glyphicon-globe" aria-hidden="true"></span>
                                    <span className="hidden-sm"> Discover</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/browse" title="Browse" className={isActive.browse}>
                                    <span className="glyphicon glyphicon-headphones" aria-hidden="true"></span>
                                    <span className="hidden-sm"> Browse</span>
                                </Link>
                                <ul className="nav nav-list text-center">
                                    <li>
                                        <Link to="/artists" title="Browse artists" className={isActive.artists}>
                                            <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
                                            <span className="sr-only">Artists</span>
                                            <span className="hidden-sm"> Artists</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/albums" title="Browse albums" className={isActive.albums}>
                                            <span className="glyphicon glyphicon-cd" aria-hidden="true"></span>
                                            <span className="sr-only">Albums</span>
                                            <span className="hidden-sm"> Albums</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/songs" title="Browse songs" className={isActive.songs}>
                                            <span className="glyphicon glyphicon-music" aria-hidden="true"></span>
                                            <span className="sr-only">Songs</span>
                                            <span className="hidden-sm"> Songs</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/search" title="Search" className={isActive.search}>
                                    <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                    <span className="hidden-sm"> Search</span>
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
