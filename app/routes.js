/**
 * Routes for the React app.
 */
import React from "react";
import { IndexRoute, Route } from "react-router";

import RequireAuthentication from "./containers/RequireAuthentication";
import App from "./containers/App";
import SimpleLayout from "./components/layouts/Simple";
import SidebarLayout from "./components/layouts/Sidebar";
import ArtistPage from "./views/ArtistPage";
import ArtistsPage from "./views/ArtistsPage";
import AlbumsPage from "./views/AlbumsPage";
import BrowsePage from "./views/BrowsePage";
import DiscoverPage from "./views/DiscoverPage";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import LogoutPage from "./views/LogoutPage";
import PlaylistPage from "./views/PlaylistPage";
import SongsPage from "./views/SongsPage";
import SettingsPage from "./views/SettingsPage";

export default (
    <Route path="/" component={App}>  // Main container is App
        <Route path="login" component={SimpleLayout}>  // Login is a SimpleLayout
            <IndexRoute component={LoginPage} />
        </Route>
        <Route component={SidebarLayout}>  // All the rest is a SidebarLayout
            <Route path="logout" component={LogoutPage} />
            <Route component={RequireAuthentication}>  // And some pages require authentication
                <Route path="discover" component={DiscoverPage} />
                <Route path="browse" component={BrowsePage} />
                <Route path="artists" component={ArtistsPage} />
                <Route path="artist/:artist" component={ArtistPage} />
                <Route path="albums" component={AlbumsPage} />
                <Route path="artist/:artist/album/:album" component={ArtistPage} />
                <Route path="songs" component={SongsPage} />
                <Route path="playlist" component={PlaylistPage} />
                <Route path="settings" component={SettingsPage} />
                <IndexRoute component={HomePage} />
            </Route>
        </Route>
    </Route>
);
