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
import ReactDOM from 'react-dom';
import Table from './table';
import * as DeleteSeries from './delete-series-dialog';
import * as EditSeries from './edit-series-dialog';

/*
    Series table - a specific instance of a table showing
    all of the series in the database.
*/
export default class SeriesTable extends Table {
    constructor(props) {
        super(props);
    }

    onBooksClick(row) {
        console.log("Books was clicked for id " + String(row.id));
        window.location.href = "/books-page?series=" + String(row.id);
    }

    onEditClick(row) {
        console.log("Edit was clicked for id " + String(row.id));
        EditSeries.editSeriesDialog(row);
    }

    onDeleteClick(row) {
        console.log("Delete was clicked for id " + String(row.id));
        // Fire up the delete dialog box
        DeleteSeries.deleteSeries(row);
    }

    // Generate the actions for authors
    getActions(row) {
        return (
            <td>
                <a href="#" onClick={this.onBooksClick.bind(this, row)}>Books</a>
                <a href="#" onClick={this.onEditClick.bind(this, row)}>Edit</a>
                <a href="#" onClick={this.onDeleteClick.bind(this, row)}>Delete</a>
            </td>
        )
    }
}

SeriesTable.propTypes = {
    title: React.PropTypes.string.isRequired,
    class: React.PropTypes.string.isRequired,
    cols: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired
};

SeriesTable.defaultProps = {
};

/*
    Create the series table instance on the series page
*/
var seriesTableInstance;
export function createSeriesTable() {
    // Defines the columns in the series table
    var seriesTableColumns = [
        { colname: 'name', label: 'Last Name', sortable: true },
        { colname: 'id', label: 'ID', sortable: true }
    ];

    console.log("Attempting to create Series table");
    // Note that the ref attribute is the preferred way to capture the rendered instance
    ReactDOM.render(<SeriesTable class={"table table-striped table-condensed"}
        title={"Series"}
        cols={seriesTableColumns}
        url={"/series"}
        ref={function(instance) {
            seriesTableInstance = instance;
        }}
        />,
        document.querySelector('#seriestable')
    );
    console.log("Series table created");
}

/*
    Reload the series table
*/
export function refreshSeriesTable() {
    seriesTableInstance.loadTable();
}

/*
    Load series table based on search/filter
*/
export function searchSeries(arg) {
    seriesTableInstance.filterTable(arg);
}
