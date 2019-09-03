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
import NewAuthorForm from "./new-author-form";
import EditAuthorForm from "./edit-author-form";
import { renderSearchAuthorsTable } from "./search-authors-table";
import { renderPagedBooksTable} from "./paged-books-table";
import { renderSearchBooksTable } from "./search-books-table";
import { renderSeriesTable } from "./series-table";
import NewBookForm from "./new-book-form";
import EditBookForm from "./edit-book-form";
import NewSeriesForm from "./new-series-form";
import EditSeriesForm from "./edit-series-form";
import { renderSearchSeriesTable } from "./search-series-table";
import { renderCategoriesTable } from "./categories-table";
import NewCategoryForm from "./new-category-form";
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
                <Route path="/new-author-form" component={NewAuthorForm} />
                <Route path="/edit-author-form/:authorid" component={EditAuthorForm} />
                <Route path="/search-authors-page/:searcharg" render={renderSearchAuthorsTable} />

                {
                // Notes on books-page path URLs.
                // The ID value will show up at the component in the props.match.params object.
                // The presence of a specific property indicates filtering by that property.
                // For example, if seriesid is present, then books are filtered by series ID.
                }
                <Route path="/books-page" exact render={renderPagedBooksTable} />
                <Route path="/search-books-page/:searcharg" render={renderSearchBooksTable} />
                <Route path="/author-books-page/:authorid" render={renderPagedBooksTable} />
                <Route path="/series-books-page/:seriesid" render={renderPagedBooksTable} />
                <Route path="/new-book-form" component={NewBookForm} />
                <Route path="/edit-book-form/:bookid" component={EditBookForm} />

                <Route path="/series-page" render={renderSeriesTable} />
                <Route path="/new-series-form" component={NewSeriesForm} />
                <Route path="/edit-series-form/:seriesid" component={EditSeriesForm} />
                <Route path="/search-series-page/:searcharg" render={renderSearchSeriesTable} />

                <Route path="/categories-page" render={renderCategoriesTable} />
                <Route path="/category-authors-page/:categoryid" render={renderAuthorsTable} />
                <Route path="/category-books-page/:categoryid" render={renderPagedBooksTable} />
                <Route path="/new-category-form" component={NewCategoryForm} />

                <Route path="/about-page" component={About} />
            </Switch>
            <h2 className="clearfix">Footer</h2>
        </BrowserRouter>
    ),
    document.getElementById('root')
);
