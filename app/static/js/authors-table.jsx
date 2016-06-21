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
import * as DeleteAuthor from './delete-author-dialog'

/*
    Authors table - a specific instance of a table showing
    all of the authors in the authors database.
*/
export default class AuthorsTable extends Table {
    constructor(props) {
        super(props);
    }

    onBooksClick(row) {
        console.log("Books was clicked for id " + String(row.id));
    }

    onShowClick(row) {
        console.log("Show was clicked for id " + String(row.id));
    }

    onEditClick(row) {
        console.log("Edit was clicked for id " + String(row.id));
    }

    onDeleteClick(row) {
        console.log("Delete was clicked for id " + String(row.id));
        // Fire up the delete dialog box
        DeleteAuthor.deleteAuthor(row);
        $("#delete-author-jsx").modal({});
    }

    // Generate the actions for authors
    getActions(row) {
        return (
            <td>
                <a href="#" onClick={this.onBooksClick.bind(this, row)}>Books</a>
                <a href="#" onClick={this.onShowClick.bind(this, row)}>Show</a>
                <a href="#" onClick={this.onEditClick.bind(this, row)}>Edit</a>
                <a href="#" onClick={this.onDeleteClick.bind(this, row)}>Delete</a>
            </td>
        )
    }
}

AuthorsTable.propTypes = {
    title: React.PropTypes.string.isRequired,
    class: React.PropTypes.string.isRequired,
    cols: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired
};

AuthorsTable.defaultProps = {
};

/*
    Create the authors table instance on the authors page
*/
var authorsTableInstance;
export function createAuthorsTable() {
    // Defines the columns in the authors table
    var authorTableColumns = [
        { colname: 'LastName', label: 'Last Name' },
        { colname: 'FirstName', label: 'First Name' },
        { colname: 'category', label: 'Category' },
        { colname: 'try_author', label: 'Try' },
        { colname: 'Avoid', label: 'Avoid' },
        { colname: 'id', label: 'ID' }
    ];

    console.log("Attempting to create Authors table");
    authorsTableInstance = ReactDOM.render(<AuthorsTable class={"table table-striped table-condensed"}
        title={"Authors"}
        cols={authorTableColumns}
        url={"/authors"}
        />,
        document.querySelector('#authorstable')
    );
    console.log("Authors table created");
}

/*
    Reload the authors table
*/
export function refreshAuthorsTable() {
    authorsTableInstance.loadTable();
}
