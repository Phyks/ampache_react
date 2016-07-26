import React, { Component } from "react";
import { IndexLink, Link} from "react-router";

export default class SidebarLayout extends Component {
    render () {
        return (
            <div>
                <div className="col-sm-3 col-md-2 sidebar hidden-xs">
                    <h1 className="text-center"><IndexLink to="/"><img alt="A" src="./app/assets/img/ampache-blue.png"/>mpache</IndexLink></h1>
                    <nav aria-label="Main navigation menu">
                        <div className="navbar text-center icon-navbar">
                            <div className="container-fluid">
                                <ul className="nav navbar-nav icon-navbar-nav">
                                    <li>
                                        <Link to="/" title="Home"><span className="glyphicon glyphicon-home" aria-hidden="true"></span> <span className="sr-only">Home</span></Link>
                                    </li>
                                    <li>
                                        <Link to="/settings" title="Settings"><span className="glyphicon glyphicon-wrench" aria-hidden="true"></span> <span className="sr-only">Settings</span></Link>
                                    </li>
                                    <li>
                                        <Link to="/logout" title="Logout"><span className="glyphicon glyphicon-off" aria-hidden="true"></span> <span className="sr-only">Logout</span></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <ul className="nav nav-sidebar">
                            <li>
                                <Link to="/discover" title="Discover">
                                    <span className="glyphicon glyphicon-globe" aria-hidden="true"></span>
                                    <span className="hidden-sm"> Discover</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/browse" title="Browse">
                                    <span className="glyphicon glyphicon-headphones" aria-hidden="true"></span>
                                    <span className="hidden-sm"> Browse</span>
                                </Link>
                                <ul className="nav nav-sidebar text-center">
                                    <li><Link to="/artists" title="Browse artists"><span className="glyphicon glyphicon-user" aria-hidden="true"></span> Artists</Link></li>
                                    <li><Link to="/albums" title="Browse albums"><span className="glyphicon glyphicon-cd" aria-hidden="true"></span> Albums</Link></li>
                                    <li><Link to="/songs" title="Browse songs"><span className="glyphicon glyphicon-music" aria-hidden="true"></span> Songs</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/search" title="Search">
                                    <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                    <span className="hidden-sm"> Search</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main-panel">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
