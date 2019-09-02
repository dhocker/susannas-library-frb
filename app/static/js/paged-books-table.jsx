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
        // Defines the columns in the authors table
        const cols = [
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

        super(props, cols);

        // The initial title. It will change when the related record is loaded.
        this.state.title = props.title;
        this.state.search_arg = "";

        // Function bindings
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onDeleteBook = this.onDeleteBook.bind(this);
        this.getActions = this.getActions.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSearchArgChanged = this.onSearchArgChanged.bind(this);
    }

    // Occurs after render on mount (not on update)
    componentDidMount() {
        this.loadBooks();
        this.setFocus();
    }

    setFocus() {
        const $this = this;
        // Trick to get focus into input text box
        setTimeout(function () {
            $this.searchInput.focus();
            $this.searchInput.select();
        }, 0);
    }

    // Load the table based on the current state
    loadBooks() {
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
        this.delete_book_row = row;
        this.showOKCancelDialogBox("Delete book?", row.Title, "Do you want to delete this book?");
    }

    // OK to delete the selected author
    onDialogOK() {
        console.log("Deleting book " + this.delete_book_row.id);
        const $this = this;
        const url = `/book/${this.delete_book_row.id}`;

        $.ajax({
            method: "DELETE",
            url: url,
            data: {},
            success: function(data, status, xhr) {
                // TODO Add timed message to page
                // $this.showMessage(`Device ${rows[row_index]["name"]} removed`);
                // Reload table to account for deleted author
                $this.loadTable($this.props.url);
            },
            error: function(xhr, status, msg) {
                $this.showDialogBox("Delete author", status, `${msg} ${xhr.responseText}`);
            }
        });
        super.onDialogOK();
    }

    // Delete dialog canceled
    onDialogCancel() {
        this.delete_book_row = null;
        super.onDialogCancel();
    }

    onSearch() {
        if (this.state.search_arg.length > 0) {
            console.log("Search called " + this.state.search_arg);
            const url = "/search-books-page/" + encodeURIComponent(this.state.search_arg);
            // Redirect to search page
            this.setState({search_url: url});
        }
    }

    // Track search argument value
    onSearchArgChanged(event) {
        if (event.key === 'Enter') {
            this.onSearch();
            return;
        }
        this.setState({
            search_arg: event.target.value
        });
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
                            <Button
                                id="search-button"
                                className="btn btn-primary btn-sm pull-right"
                                onClick={this.onSearch}
                            >
                                Search
                            </Button>
                            <input
                                type="text"
                                className="form-control pull-right"
                                id="search-text"
                                value={this.state.search_arg}
                                onChange={this.onSearchArgChanged}
                                onKeyPress={this.onSearchArgChanged}
                                ref={(instance) => {
                                    this.searchInput = instance;
                                }}
                            />
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
    url: PropTypes.string.isRequired
};

PagedBooksTable.defaultProps = {
};

/*
    Create the books table instance on the books page
*/
let pagedBooksTableInstance = null;
export function renderPagedBooksTable(props) {

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
