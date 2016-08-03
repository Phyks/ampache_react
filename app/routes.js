import React from "react";
import { IndexRoute, Route } from "react-router";

import RequireAuthentication from "./containers/RequireAuthentication";
import App from "./containers/App";
import SimpleLayout from "./components/layouts/Simple";
import SidebarLayout from "./components/layouts/Sidebar";
import BrowsePage from "./views/BrowsePage";
import DiscoverPage from "./views/DiscoverPage";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import LogoutPage from "./views/LogoutPage";
import ArtistsPage from "./views/ArtistsPage";
import AlbumsPage from "./views/AlbumsPage";
import SongsPage from "./views/SongsPage";
import ArtistPage from "./views/ArtistPage";
import AlbumPage from "./views/AlbumPage";

export default (
    <Route path="/" component={App}>
        <Route path="login" component={SimpleLayout}>
            <IndexRoute component={LoginPage} />
        </Route>
        <Route component={SidebarLayout}>
            <Route path="logout" component={LogoutPage} />
            <Route component={RequireAuthentication}>
                <Route path="discover" component={DiscoverPage} />
                <Route path="browse" component={BrowsePage} />
                <Route path="artists" component={ArtistsPage} />
                <Route path="artist/:id" component={ArtistPage} />
                <Route path="albums" component={AlbumsPage} />
                <Route path="album/:id" component={AlbumPage} />
                <Route path="songs" component={SongsPage} />
                <IndexRoute component={HomePage} />
            </Route>
        </Route>
    </Route>
);
