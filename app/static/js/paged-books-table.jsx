/*
    Susanna's New Library
    Copyright © 2016  Dave Hocker (email: AtHomeX10@gmail.com)

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
import PropTypes from 'prop-types';
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from 'react-bootstrap';
import PagedTable from './paged-table';
import $ from 'jquery';

/*
    Paged Books table - a specific instance of a paged table showing
    all of the books in the database or all of the books for an author.
*/
export default class PagedBooksTable extends PagedTable {
    constructor(props) {
        super(props);

        // The initial title. It will change when the related record is loaded.
        this.state.title = props.title;

        // Function bindings
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onDeleteBook = this.onDeleteBook.bind(this);
        this.getActions = this.getActions.bind(this);
    }

    componentDidMount() {
        const $this = this;

        $this.loadTable();

        // Load related record
        switch (this.props.filter_by) {
            case "author":
                $this.loadAuthor(this.props.filter_by_id);
                break;
            case "series":
                break;
            case "category":
                break;
            default:
                break;
        }
    }

    // Books for an author
    loadAuthor(authorid) {
        const $this = this;
        const url = "/author/" + String(authorid);
        $.get(url, function (response /* , status */) {
            const author = response.data;
            let author_title = `${$this.props.title} ${author.FirstName} ${author.LastName}`;

            $this.setState({title: author_title});
        });
    }

    onDeleteBook(row) {
        console.log("Delete was clicked for id " + String(row.id));
        // Fire up the delete dialog box
        // DeleteBook.deleteBook(row);
    }

    // Generate the title for the books page
    getTitle() {
        return (
            <div className="card">
                <div className="row">
                    <div className="col-md-8">
                        <h2>{this.state.title}</h2>
                    </div>
                    <div className="col-md-4">
                        <form className="form-inline">
                            <button id="search-button" className="btn btn-primary btn-sm pull-right" type="button">Search</button>
                            <input type="text" className="form-control pull-right" id="search-text" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Generate the actions for authors
    getActions(row) {
        return (
            <td>
                <Navbar className="bg-light navbar-inline">
                    <Nav className="">
                        <LinkContainer to={"/edit-book-form/" + row.id} className="">
                            <Button className="nav-btn-inline btn-primary btn-sm">Edit</Button>
                        </LinkContainer>
                        <Button className="nav-btn-inline btn-primary btn-sm" onClick={this.onDeleteBook.bind(this, row)}>Delete</Button>
                    </Nav>
                </Navbar>
            </td>
        );
    }
}

PagedBooksTable.propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    cols: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired
};

PagedBooksTable.defaultProps = {
};

/*
    Create the books table instance on the books page
*/
let pagedBooksTableInstance;
export function renderPagedBooksTable(props) {
    // Defines the columns in the authors table
    const bookTableColumns = [
        { colname: 'Title', label: 'Title', sortable: true },
        { colname: 'Volume', label: 'Volume', sortable: false },
        { colname: 'Series', label: 'Series', sortable: true },
        { colname: 'Author', label: 'Author', sortable: true },
        { colname: 'Category', label: 'Category', sortable: true },
        { colname: 'Status', label: 'Status', sortable: true },
        { colname: 'CoverType', label: 'CoverType', sortable: true },
        { colname: 'Notes', label: 'Notes', sortable: false },
        { colname: 'id', label: 'ID', sortable: true }
    ];

    // Apply filtering
    let url = "/paged-books";
    let title = "Books";
    let filter_by = "";
    let id = "";
    if (props.match.params.hasOwnProperty('authorid')) {
        const {authorid} = props.match.params;
        title = "Books for author ";
        url += "?author=" + authorid;
        id = authorid;
        filter_by = "author";
    }
    else if (props.match.params.hasOwnProperty('seriesid')) {
        const {seriesid} = props.match.params;
        url += "?series=" + seriesid;
        title = "Books for Series ";
        id = seriesid;
        filter_by = "series";
    }
    else if (props.match.params.hasOwnProperty('categoryid')) {
        const {categoryid} = props.match.params;
        url += "?category=" + categoryid;
        title = "Books for Category ";
        id = categoryid;
        filter_by = "category";
    }
    else {
        // Default
    }

    // Note that the ref attribute is the preferred way to capture the rendered instance
    return (
        <PagedBooksTable
            class="table table-striped table-condensed"
            title={title}
            filter_by={filter_by}
            filter_by_id={id}
            cols={bookTableColumns}
            url={url}
            ref={(instance) => {
                pagedBooksTableInstance = instance;
            }}
        />
    );
}

/*
    Load authors table based on search/filter
*/
export function searchBooks(arg) {
    pagedBooksTableInstance.filterTable(arg);
}
