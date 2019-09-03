/*
    Categories Table
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
import PropTypes from 'prop-types';
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from 'react-bootstrap';
import PagedTable from './paged-table';
import $ from 'jquery';

/*
    Categories table - a specific instance of a table showing
    all of the series in the database.
*/
export default class CategoriesTable extends PagedTable {
    constructor(props) {
        // Defines the columns in the categories table
        const cols = [
            { colname: 'name', label: 'Name', sortable: true },
            { colname: 'id', label: 'ID', sortable: true }
        ];
        super(props, cols);

        // The initial title. It will change when the related record is loaded.
        this.state.title = props.title;
        this.state.search_arg = "";

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSearchArgChanged = this.onSearchArgChanged.bind(this);
    }


    // Only at component creation
    componentDidMount() {
        this.loadTable();
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

    onSearch() {
        if (this.state.search_arg.length > 0) {
            console.log("Search called " + this.state.search_arg);
            const url = "/search-categories-page/" + encodeURIComponent(this.state.search_arg);
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

    onDelete(row) {
        console.log("Delete was clicked for id " + String(row.id));
        this.delete_category_row = row;
        this.showOKCancelDialogBox("Delete category?", row.name, "Do you want to delete this category?");
    }

    // OK to delete the selected author
    onDialogOK() {
        console.log("Deleting author " + this.delete_category_row.id);
        const $this = this;
        const url = `/category/${this.delete_category_row.id}`;

        $.ajax({
            method: "DELETE",
            url: url,
            data: {},
            success: function(data, status, xhr) {
                // Reload table to account for deleted category
                $this.loadTable();
            },
            error: function(xhr, status, msg) {
                $this.showDialogBox("Delete category", status, `${msg} ${xhr.responseText}`);
            }
        });
        super.onDialogOK();
    }

    // Delete dialog canceled
    onDialogCancel() {
        this.delete_category_row = null;
        super.onDialogCancel();
    }

    // Generate the title for the categories page
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
                        <LinkContainer to={"/category-authors-page/" + row.id} className="">
                            <Button className="nav-btn-inline btn-primary btn-sm">Authors</Button>
                        </LinkContainer>
                        <LinkContainer to={"/category-books-page/" + row.id} className="">
                            <Button className="nav-btn-inline btn-primary btn-sm">Books</Button>
                        </LinkContainer>
                        <LinkContainer to={"/edit-category-form/" + row.id} className="">
                            <Button className="nav-btn-inline btn-primary btn-sm">Edit</Button>
                        </LinkContainer>
                        <Button className="nav-btn-inline btn-primary btn-sm" onClick={this.onDelete.bind(this, row)}>Delete</Button>
                    </Nav>
                </Navbar>
            </td>
        );
    }
}

CategoriesTable.propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
};

CategoriesTable.defaultProps = {
};

export function renderCategoriesTable() {
    return (
        <CategoriesTable
            class="table table-striped table-condensed"
            title="Categories"
            url="/categories"
        />
    );
}
