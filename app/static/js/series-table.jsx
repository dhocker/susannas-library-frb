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
import PropTypes from 'prop-types';
import PagedTable from './paged-table';
import * as DeleteSeries from './delete-series-dialog';
import * as EditSeries from './edit-series-dialog';
import ActionAnchor from './action-anchor';

/*
    Series table - a specific instance of a table showing
    all of the series in the database.
*/
export default class SeriesTable extends PagedTable {
    constructor(props) {
        super(props);

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const $this = this;

        $this.loadTable();

        // On series add, reload table
        $("#new-series").on("frb.series.add", function (/* event */) {
            console.log("On add event, reload series");
            $this.loadTable();
        });

        // On series delete, reload table
        $("#delete-series").on("frb.series.delete", function (/* event */) {
            console.log("On delete event, reload series");
            $this.loadTable();
        });

        // On series edit, reload table
        $("#edit-series").on("frb.series.edit", function (/* event */) {
            console.log("On edit event, reload series");
            $this.loadTable();
        });
    }

    onBooksClick(row) {
        console.log("Books was clicked for id " + String(row.id));
        window.location.href = "/paged-books-page?series=" + String(row.id);
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

SeriesTable.propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    cols: PropTypes.arrayOf(PropTypes.string).isRequired,
    url: PropTypes.string.isRequired
};

SeriesTable.defaultProps = {
};

/*
    Create the series table instance on the series page
*/
let seriesTableInstance;
export function createSeriesTable() {
    // Defines the columns in the series table
    const seriesTableColumns = [
        { colname: 'name', label: 'Name', sortable: true },
        { colname: 'id', label: 'ID', sortable: true }
    ];

    console.log("Attempting to create Series table");
    // Note that the ref attribute is the preferred way to capture the rendered instance
    ReactDOM.render(
        <SeriesTable
            class={"table table-striped table-condensed"}
            title={"Series"}
            cols={seriesTableColumns}
            url={"/series"}
            ref={(instance) => {
                seriesTableInstance = instance;
            }}
        />,
        document.querySelector('#seriestable')
    );
    console.log("Series table created");
}

/*
    Load series table based on search/filter
*/
export function searchSeries(arg) {
    seriesTableInstance.filterTable(arg);
}
