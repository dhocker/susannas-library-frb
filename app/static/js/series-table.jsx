/*
    Series Table
    Copyright (C) 2016  Dave Hocker (email: AtHomeX10@gmail.com)

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
    Series table - a specific instance of a table showing
    all of the series in the database.
*/
export default class SeriesTable extends PagedTable {
    constructor(props) {
        // Defines the columns in the series table
        const cols = [
            { colname: 'name', label: 'Name', sortable: true },
            { colname: 'id', label: 'ID', sortable: true }
        ];

        super(props, cols);

        // The initial title. It will change when the related record is loaded.
        this.state.title = props.title;
        this.state.search_arg = "";

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSearchArgChanged = this.onSearchArgChanged.bind(this);
    }

    componentDidMount() {
        this.loadTable();
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
        console.log("Search called " + this.state.search_arg);
        const url = "/search-series-page/" + this.state.search_arg;
        // Redirect to search page
        this.setState({search_url: url});
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
        this.delete_series_row = row;
        this.showOKCancelDialogBox("Delete series?", row.name, "Do you want to delete this series?");
    }

    // OK to delete the selected author
    onDialogOK() {
        console.log("Deleting series " + this.delete_series_row.id);
        const $this = this;
        const url = `/series/${this.delete_series_row.id}`;

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
        this.delete_author_row = null;
        super.onDialogCancel();
    }

    // Generate the title for the authors page
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

    // Generate the actions for series
    getActions(row) {
        return (
            <td>
                <Navbar className="bg-light navbar-inline">
                    <Nav className="">
                        <LinkContainer to={"/series-books-page/" + row.id} className="">
                            <Button className="nav-btn-inline btn-primary btn-sm">Books</Button>
                        </LinkContainer>
                        <LinkContainer to={"/edit-series-form/" + row.id} className="">
                            <Button className="nav-btn-inline btn-primary btn-sm">Edit</Button>
                        </LinkContainer>
                        <Button className="nav-btn-inline btn-primary btn-sm" onClick={this.onDelete.bind(this, row)}>Delete</Button>
                    </Nav>
                </Navbar>
            </td>
        );
    }
}

SeriesTable.propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
};

SeriesTable.defaultProps = {
};

/*
    Create the series table instance on the series page
*/
export function renderSeriesTable() {
    return (
        <SeriesTable
            class="table table-striped table-condensed"
            title="Series"
            url="/series"
        />
    );
}
