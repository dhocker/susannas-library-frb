/*
    Susanna's New Library
    Copyright © 2016, 2019  Dave Hocker (email: AtHomeX10@gmail.com)

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
    Authors table - a specific instance of a table showing
    all of the authors in the authors database.
*/
export default class AuthorsTable extends PagedTable {
    constructor(props) {
        super(props);

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const $this = this;

        $this.loadTable();
    }

    onDeleteAuthor(row) {
        this.delete_author_row = row;
        this.showOKCancelDialogBox("Delete author?", row.LastName + " " + row.FirstName, "Do you want to delete this author?");
    }

    // OK to delete the selected author
    onDialogOK() {
        console.log("Deleting author " + this.delete_author_row.id);
        const $this = this;
        const url = `/author/${this.delete_author_row.id}`;

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
                        <h2>{this.props.title}</h2>
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
                        <LinkContainer to={"/books-page/author/" + row.id} className="">
                            <Button className="nav-btn-inline btn-primary btn-sm">Books</Button>
                        </LinkContainer>
                        <LinkContainer to={"/edit-author-form/" + row.id} className="">
                            <Button className="nav-btn-inline btn-primary btn-sm">Edit</Button>
                        </LinkContainer>
                        <Button className="nav-btn-inline btn-primary btn-sm" onClick={this.onDeleteAuthor.bind(this, row)}>Delete</Button>
                    </Nav>
                </Navbar>
            </td>
        );
    }
}

AuthorsTable.propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    cols: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired
};

AuthorsTable.defaultProps = {
};

export function renderAuthorsTable(props) {
    // Defines the columns in the authors table
    const authorTableColumns = [
        { colname: 'LastName', label: 'Last Name', sortable: true },
        { colname: 'FirstName', label: 'First Name', sortable: true },
        { colname: 'category', label: 'Category', sortable: true },
        { colname: 'try_author', label: 'Try', sortable: true },
        { colname: 'Avoid', label: 'Avoid', sortable: true },
        { colname: 'id', label: 'ID', sortable: true }
    ];

    // The query parameters are in props.location.search
    // See this article: https://tylermcginnis.com/react-router-query-strings/

    // Apply filtering
    let filter_by = "";
    let id = "";
    let name = "";
    let url = "/authors";
    let title = "Authors";
    switch (filter_by) {
        case "category":
            url += "?category=" + id;
            title = "Authors for Category: " + name;
            break;
        default:
            title = "Authors";
            break;
    }

    return (
        <AuthorsTable
            class="table table-striped table-condensed"
            title={title}
            cols={authorTableColumns}
            filter_by={filter_by}
            filter_by_id={id}
            url={url}
            {...props}
        />
    );
}
