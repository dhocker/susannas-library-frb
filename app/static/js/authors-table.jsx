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
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PagedTable from './paged-table';
import * as DeleteAuthor from './delete-author-dialog';
import * as EditAuthor from './edit-author-dialog';
import ActionAnchor from './action-anchor';

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

        // On author add, reload table
        $("#new-author").on("frb.author.add", function (/* event */) {
            console.log("On add event, reload authors");
            $this.loadTable();
        });

        // On author delete, reload table
        $("#delete-author").on("frb.author.delete", function (/* event */) {
            console.log("On delete event, reload authors");
            $this.loadTable();
        });

        // On author edit, reload table
        $("#edit-author").on("frb.author.edit", function (/* event */) {
            console.log("On edit event, reload authors");
            $this.loadTable();
        });
    }

    onBooksClick(row) {
        console.log("Books was clicked for id " + String(row.id));
        window.location.href = "/paged-books-page?author=" + String(row.id);
    }

    onEditClick(row) {
        console.log("Edit was clicked for id " + String(row.id));
        EditAuthor.editAuthorDialog(row);
    }

    onDeleteClick(row) {
        console.log("Delete was clicked for id " + String(row.id));
        // Fire up the delete dialog box
        DeleteAuthor.deleteAuthor(row);
    }

    // Generate the actions for authors
    getActions(row) {
        return (
            <td>
                <ActionAnchor
                    htmlHref="#books"
                    onItemClick={this.onBooksClick}
                    item={row}
                    anchorText="Books"
                />
                <ActionAnchor
                    htmlHref="#edit"
                    onItemClick={this.onEditClick}
                    item={row}
                    anchorText="Edit"
                />
                <ActionAnchor
                    htmlHref="#delete"
                    onItemClick={this.onDeleteClick}
                    item={row}
                    anchorText="Delete"
                />
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

/*
    Create the authors table instance on the authors page
*/
let authorsTableInstance;
export function createAuthorsTable(filter_by, id, name) {
    // Defines the columns in the authors table
    const authorTableColumns = [
        { colname: 'LastName', label: 'Last Name', sortable: true },
        { colname: 'FirstName', label: 'First Name', sortable: true },
        { colname: 'category', label: 'Category', sortable: true },
        { colname: 'try_author', label: 'Try', sortable: true },
        { colname: 'Avoid', label: 'Avoid', sortable: true },
        { colname: 'id', label: 'ID', sortable: true }
    ];

    // Apply filtering
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

    console.log("Attempting to create Authors table");
    // Note that the ref attribute is the preferred way to capture the rendered instance
    ReactDOM.render(
        <AuthorsTable
            class={"table table-striped table-condensed"}
            title={title}
            cols={authorTableColumns}
            filter_by={filter_by}
            filter_by_id={id}
            url={url}
            ref={(instance) => {
                authorsTableInstance = instance;
            }}
        />,
        document.querySelector('#authorstable')
    );
    console.log("Authors table created");
}

/*
    Load authors table based on search/filter
*/
export function searchAuthors(arg) {
    authorsTableInstance.filterTable(arg);
}
