/*
    flask-react - web server for learning to use react front end with Flask back end
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
import ReactDOM from 'react-dom';
import Table from './table';
//import * as DeleteAuthor from './delete-author-dialog';
//import * as EditAuthor from './edit-author-dialog';

/*
    Books table - a specific instance of a table showing
    all of the books in the database or all of the books for an author.
*/
export default class BooksTable extends Table {
    constructor(props) {
        super(props);
    }

    onEditClick(row) {
        console.log("Edit was clicked for id " + String(row.id));
        //EditAuthor.editAuthorDialog(row);
    }

    onDeleteClick(row) {
        console.log("Delete was clicked for id " + String(row.id));
        // Fire up the delete dialog box
        //DeleteAuthor.deleteAuthor(row);
    }

    // Generate the actions for authors
    getActions(row) {
        return (
            <td>
                <a href="#" onClick={this.onEditClick.bind(this, row)}>Edit</a>
                <a href="#" onClick={this.onDeleteClick.bind(this, row)}>Delete</a>
            </td>
        )
    }
}

BooksTable.propTypes = {
    title: React.PropTypes.string.isRequired,
    class: React.PropTypes.string.isRequired,
    cols: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired
};

BooksTable.defaultProps = {
};

/*
    Create the books table instance on the books page
*/
var booksTableInstance;
export function createBooksTable(author_id, author_name) {
    // Defines the columns in the authors table
    var bookTableColumns = [
        { colname: 'Title', label: 'Title' },
        { colname: 'Volume', label: 'Volume' },
        { colname: 'Series', label: 'Series' },
        { colname: 'Category', label: 'Category' },
        { colname: 'Status', label: 'Status' },
        { colname: 'CoverType', label: 'CoverType' },
        { colname: 'Notes', label: 'Notes' },
        { colname: 'id', label: 'ID' }
    ];

    var url = "/books";
    var title = "Books";
    if (author_id.length > 0) {
        url += "?a=" + author_id;
        title = "Books for " + String(author_name);
    }

    console.log("Attempting to create Authors table");
    booksTableInstance = ReactDOM.render(<BooksTable class={"table table-striped table-condensed"}
        title={title}
        cols={bookTableColumns}
        url={url}
        />,
        document.querySelector('#bookstable')
    );
    console.log("Books table created");
}

/*
    Reload the authors table
*/
export function refreshBooksTable() {
    booksTableInstance.loadTable();
}

/*
    Load authors table based on search/filter
*/
export function searchBooks(arg) {
    booksTableInstance.filterTable(arg);
}
