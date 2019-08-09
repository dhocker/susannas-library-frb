/*
    Susanna's Library
    Copyright © 2019  Dave Hocker (email: AtHomeX10@gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the LICENSE file for more details.

    You should have received a copy of the GNU General Public License
    along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter, Route, Switch
} from "react-router-dom";
import Navigation from "./navigation";
import { renderAuthorsTable } from "./authors-table";
// import '../css/index.css';
// import App from './app';
// import * as serviceWorker from './serviceWorker';

/*
Bootstrap
See: https://getbootstrap.com/docs/4.0/getting-started/webpack/
*/
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
/*
Bootstrap css customizations MUST come after Bootstrap css
*/
// import '../style.css';
import '../css/bootstrap-custom.css';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

function NewAuthor() {
    return <h2>New Author</h2>;
}

function Books() {
    return <h2>Books</h2>;
}

function Series() {
    return <h2>Series</h2>;
}

function Categories() {
    return <h2>Categories</h2>;
}

function About() {
    return <h2>About the Library</h2>;
}

ReactDOM.render(
    (
        <BrowserRouter>
            <Navigation />
            <Switch>
                <Route path="/" exact render={renderAuthorsTable} />
                <Route path="/authors-page" render={renderAuthorsTable} />
                <Route path="/new-author-page" component={NewAuthor} />
                <Route path="/books-page" component={Books} />
                <Route path="/series-page" component={Series} />
                <Route path="/categories-page" component={Categories} />
                <Route path="/about-page" component={About} />
            </Switch>
            <h2>Footer</h2>
        </BrowserRouter>
    ),
    document.getElementById('root')
);
