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
import Table from './table';
import * as DeleteBook from './delete-book-dialog';
import * as EditBook from './edit-book-dialog';
import ActionAnchor from './action-anchor';

/*
    Books table - a specific instance of a table showing
    all of the books in the database or all of the books for an author.
*/
export default class BooksTable extends Table {
    constructor(props) {
        super(props);

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const $this = this;

        $this.loadTable();

        // On book add, reload table
        $("#new-book").on("frb.book.add", function (/* event */) {
            console.log("On add event, reload books");
            $this.loadTable();
        });

        // On book delete, reload table
        $("#delete-book").on("frb.book.delete", function (/* event */) {
            console.log("On delete event, reload books");
            $this.loadTable();
        });

        // On book edit, reload table
        $("#edit-book").on("frb.book.edit", function (/* event */) {
            console.log("On edit event, reload books");
            $this.loadTable();
        });
    }

    onEditClick(row) {
        console.log("Edit was clicked for id " + String(row.id));
        EditBook.editBookDialog(row);
    }

    onDeleteClick(row) {
        console.log("Delete was clicked for id " + String(row.id));
        // Fire up the delete dialog box
        DeleteBook.deleteBook(row);
    }

    // Generate the actions for authors
    getActions(row) {
        return (
            <td>
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

BooksTable.propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    cols: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired
};

BooksTable.defaultProps = {
};

/*
    Create the books table instance on the books page
*/
let booksTableInstance;
export function createBooksTable(filter_by, id, name) {
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
    let url = "/books";
    let title = "Books";
    switch (filter_by) {
    case "author":
        url += "?author=" + id;
        title = "Books for Author: " + name;
        break;
    case "series":
        url += "?series=" + id;
        title = "Books for Series: " + name;
        break;
    default:
        break;
    }

    console.log("Attempting to create Authors table");
    // Note that the ref attribute is the preferred way to capture the rendered instance
    ReactDOM.render(
        <BooksTable
            class={"table table-striped table-condensed"}
            title={title}
            filter_by={filter_by}
            filter_by_id={id}
            cols={bookTableColumns}
            url={url}
            ref={(instance) => {
                booksTableInstance = instance;
            }}
        />,
        document.querySelector('#bookstable')
    );
    console.log("Books table created");
}

/*
    Load authors table based on search/filter
*/
export function searchBooks(arg) {
    booksTableInstance.filterTable(arg);
}
