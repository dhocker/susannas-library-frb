/*
    Susanna's New Library
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

/*
    This is the beginning of a basic React component that can render a table with actions.
    It is designed to be extended by a derived class where custom actions are defined.
    After learning how modules work, we can move on to looking at
    various React datagrids and tables that can be found on GitHub.
*/

const SORT_ASC = 1;
const SORT_DESC = -1;
const SORT_INVERT = -1;

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        this.column_count = props.cols.length;
        this.sort_col = 0;
        this.sort_dir = [];
        // 1 = sort asc, -1 = sort desc
        for (let i = 0; i < this.column_count; i++) {
            // Set up the NEXT sort direction
            if (i > 0) {
                this.sort_dir.push(SORT_ASC);
            }
            else {
                // The first column is the default sort column, so it is already sorted asc
                this.sort_dir.push(SORT_DESC);
            }
        }

        // Initial state with empty rows
        this.state = {
            rows: [],
        };

        this.onSortColumn = this.onSortColumn.bind(this);
        this.sortRows = this.sortRows.bind(this);
    }

    // Override in derived class to provide actions for table
    getActions() {
        return <td></td>;
    }

    // This will load the table when the component is mounted
    componentDidMount() {
        this.loadTable();
    }

    // This can be called to initially load the table or to refresh the table
    // after inserts, updates or deletes
    loadTable() {
        console.log("Getting all records from url " + this.props.url);
        const $this = this;
        $.get(this.props.url, function (response /* , status */) {
            console.log("Data rows received: " + String(response.data.length));
            const rows = response.data;
            // Repeat the last sort
            if ($this.sort_col === 0 && $this.sort_dir[0] === SORT_DESC) {
                // Default sort, do nothing
            }
            else {
                $this.sortRows(rows, $this.sort_col, $this.sort_dir[$this.sort_col] * SORT_INVERT);
            }
            $this.setState({rows: rows});
        });
    }

    // Loads the table with the results of a get + search arg (filter)
    filterTable(arg) {
        const $this = this;
        let url = this.props.url;
        console.log("Base filter url: " + url);
        if (url.includes('?')) {
            url += "&search=" + arg;
        }
        else {
            url += "?search=" + arg;
        }
        console.log("Full filter url: " + url);
        $.ajax({
            type: "GET",
            url: url,
            success: (response) => {
                console.log("Data rows received: " + String(response.data.length));
                $this.setState({rows: response.data});
            },
            error: (xhr, status, err) => {
                console.error("AJAX search call failed");
                console.error(url, status, err.toString());
            },
        });
    }

    // Sort rows for a given column and direction
    sortRows(rows, i, dir) {
        const $this = this;
        console.log("Sorting");
        rows.sort(function (left, right) {
            // Sort direction: 1 = asc, -1 = desc
            return dir * String(left[$this.props.cols[i].colname])
                .localeCompare(right[$this.props.cols[i].colname]);
        });
    }

    // Sorts the table based on the given column index
    onSortColumn(i) {
        console.log("Sort column: " + String(i));
        // Sort
        this.sortRows(this.state.rows, i, this.sort_dir[i]);
        this.setState({rows: this.state.rows});
        // Flip the sort direction
        this.sort_dir[i] = SORT_INVERT * this.sort_dir[i];
        // Remember last sorted column
        this.sort_col = i;
    }

    render() {
        const HeaderComponents = this.generateHeaders();
        const RowComponents = this.generateRows();
        const FooterComponents = this.generateFooter();

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h2>{this.props.title}</h2>
                </div>
                <div className="panel-body">
                    <table className={this.props.class}>
                        <thead>{HeaderComponents}</thead>
                        <tfoot>{FooterComponents}</tfoot>
                        <tbody>{RowComponents}</tbody>
                    </table>
                </div>
            </div>
        );
    }

    generateHeaders() {
        const cols = this.props.cols;
        // generate our header (th) cell components
        const cells = cols.map(function (colData, i) {
            if (cols[i].sortable) {
                return (
                    <th
                        key={colData.colname}
                        onClick={this.onSortColumn.bind(this, i)}
                        style={{cursor: 'pointer'}}
                    >
                        {colData.label}
                    </th>);
            }

            return (
                <th
                    key={colData.colname}
                >
                    {colData.label}
                </th>);
        }, this);

        // return a single header row
        return (<tr>
            {cells}
            <th>Actions</th>
        </tr>);
    }

    generateRows() {
        const cols = this.props.cols;  // [{colname, label}]
        const rows = this.state.rows;
        const $this = this;

        return rows.map(function (row) {
            // handle the column data within each row
            const cells = cols.map(function (colData) {
                // colData.colname might be "FirstName"
                return <td key={colData.colname}>{row[colData.colname]}</td>;
            });
            const actions = $this.getActions(row);
            return (<tr key={row.id}>
                {cells}
                {actions}
            </tr>);
        });
    }

    generateFooter() {
        return <tr><td>{"Total Rows"}</td><td>{this.state.rows.length}</td></tr>;
    }
}

Table.propTypes = {
    title: React.PropTypes.string.isRequired,
    class: React.PropTypes.string.isRequired,
    cols: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired,
};

Table.defaultProps = {
};
