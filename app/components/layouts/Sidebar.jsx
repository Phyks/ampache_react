import React, { Component } from "react";
import { IndexLink, Link} from "react-router";

export default class SidebarLayout extends Component {
    render () {
        return (
            <div>
                <div className="col-sm-3 col-md-2 sidebar hidden-xs">
                    <h1 className="text-center"><IndexLink to="/"><img alt="A" src="./app/assets/img/ampache-blue.png"/>mpache</IndexLink></h1>
                    <nav>
                        <div className="navbar text-center icon-navbar">
                            <div className="container-fluid">
                                <ul className="nav navbar-nav icon-navbar-nav">
                                    <li aria-hidden="true">
                                        <Link to="/" className="glyphicon glyphicon-home"></Link>
                                    </li>
                                    <li aria-hidden="true">
                                        <Link to="/settings" className="glyphicon glyphicon-wrench"></Link>
                                    </li>
                                    <li aria-hidden="true">
                                        <Link to="/logout" className="glyphicon glyphicon-off"></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <ul className="nav nav-sidebar">
                            <li>
                                <Link to="/discover">
                                    <span className="glyphicon glyphicon-globe" aria-hidden="true"></span>
                                    <span className="hidden-sm"> Discover</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/browse">
                                    <span className="glyphicon glyphicon-headphones" aria-hidden="true"></span>
                                    <span className="hidden-sm"> Browse</span>
                                </Link>
                                <ul className="nav nav-sidebar text-center">
                                    <li><Link to="/artists"><span className="glyphicon glyphicon-user"></span> Artists</Link></li>
                                    <li><Link to="/albums"><span className="glyphicon glyphicon-cd" aria-hidden="true"></span> Albums</Link></li>
                                    <li><Link to="/songs"><span className="glyphicon glyphicon-music"></span> Songs</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/search">
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
