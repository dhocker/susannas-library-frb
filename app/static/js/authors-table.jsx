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


export default class AuthorsTable extends Table {
    constructor(props) {
        super(props);
    }

    onBooksClick(id) {
        console.log("Books was clicked for id " + String(id));
    }

    onShowClick(id) {
        console.log("Show was clicked for id " + String(id));
    }

    onEditClick(id) {
        console.log("Edit was clicked for id " + String(id));
    }

    onDeleteClick(id) {
        console.log("Delete was clicked for id " + String(id));
    }

    // Generate the actions for authors
    getActions(id) {
        return (
            <td>
                <a href="#" onClick={this.onBooksClick.bind(this, id)}>Books</a>
                <a href="#" onClick={this.onShowClick.bind(this, id)}>Show</a>
                <a href="#" onClick={this.onEditClick.bind(this, id)}>Edit</a>
                <a href="#" onClick={this.onDeleteClick.bind(this, id)}>Delete</a>
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
