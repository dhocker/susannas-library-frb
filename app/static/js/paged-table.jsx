/*
    Susanna's New Library - Page Table Element
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
import * as sitecookies from './site-cookies';

/*
    This is the beginning of a basic React component that can render a paged table with actions.
    It is designed to be extended by a derived class where custom actions are defined.
    Uses Bootstrap CSS.
*/

const SORT_ASC = 1;
const SORT_INVERT = -1;

export default class PagedTable extends React.Component {
    constructor(props) {
        super(props);

        this.column_count = props.cols.length;
        this.sort_col = 0;
        this.sort_dir = [];
        // 1 = sort asc, -1 = sort desc
        for (let i = 0; i < this.column_count; i++) {
            // Set up the current sort direction
            this.sort_dir.push(SORT_ASC);
        }

        // Initial state with empty rows
        this.current_page = 0;
        this.page_size = sitecookies.getPageSize();
        this.total_count = 0;
        this.search_arg = "";
        this.state = {
            rows: [],
            current_page: this.current_page,
            page_size: String(this.page_size),
        };

        this.onSortColumn = this.onSortColumn.bind(this);
        this.onPreviousPage = this.onPreviousPage.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
        this.onFirstPage = this.onFirstPage.bind(this);
        this.onLastPage = this.onLastPage.bind(this);
        this.pageSizeChanged = this.pageSizeChanged.bind(this);
        this.onSetPageSize = this.onSetPageSize.bind(this);
        this.loadTable = this.loadTable.bind(this);
        this.filterTable = this.filterTable.bind(this);
        this.buildUrl = this.buildUrl.bind(this);
    }

    // Override in derived class to provide actions for table
    getActions() {
        return <td></td>;
    }

    // This will load the table when the component is mounted
    componentDidMount() {
        this.loadTable();
    }

    onFirstPage(/* event */) {
        if (this.current_page > 0) {
            this.current_page = 0;
            this.setState({current_page: this.current_page});
            this.loadTable();
        }
    }

    onPreviousPage(/* event */) {
        if (this.state.current_page > 0) {
            this.current_page -= 1;
            this.setState({current_page: this.current_page});
            this.loadTable();
        }
    }

    onNextPage(/* event */) {
        if (this.current_page < (this.total_pages - 1)) {
            this.current_page += 1;
            this.setState({current_page: this.current_page});
            this.loadTable();
        }
    }

    onLastPage(/* event */) {
        if (this.total_pages > 1) {
            this.current_page = this.total_pages - 1;
            this.setState({current_page: this.current_page});
            this.loadTable();
        }
    }

    pageSizeChanged(event) {
        if (event.target.value.length) {
            const ps = parseInt(event.target.value, 10);
            // If the new value is not valid, ignore the key stroke
            if ((!isNaN(ps)) && (ps > 0)) {
                this.page_size = ps;
                this.setState({
                    page_size: String(ps)
                });
            }
        }
        else {
            this.setState({
                page_size: event.target.value
            });
        }
    }

    onSetPageSize(/* event */) {
        // Reload the table from the first page
        this.current_page = 0;
        sitecookies.setPageSize(this.page_size);
        this.setState({current_page: this.current_page});
        this.loadTable();
    }

    // This can be called to initially load the table or to refresh the table
    // after inserts, updates or deletes
    loadTable() {
        const $this = this;
        const url = this.buildUrl();
        $.get(url, function (response /* , status */) {
            console.log("Data rows received: " + String(response.data.rows.length));
            console.log("Total row count: " + String(response.data.count));

            // The returned rows and the total row count
            const rows = response.data.rows;
            $this.total_count = response.data.count;

            // Figure out how many pages
            $this.total_pages = Math.floor($this.total_count / $this.page_size);
            if ($this.total_count % $this.page_size) {
                $this.total_pages += 1;
            }

            console.log("Total pages: " + String($this.total_pages));
            $this.setState({rows: rows, total_pages: $this.total_pages});
        });
    }

    // Loads the table with the results of a get + search arg (filter)
    filterTable(arg) {
        const $this = this;
        this.search_arg = arg;
        const url = this.buildUrl();
        $.ajax({
            type: "GET",
            url: url,
            success: function (response) {
                console.log("Data rows received: " + String(response.data.rows.length));
                console.log("Count: " + String(response.data.count));

                // Figure out how many pages
                $this.total_count = response.data.count;
                $this.total_pages = Math.floor($this.total_count / $this.page_size);
                if ($this.total_count % $this.page_size) {
                    $this.total_pages += 1;
                }

                console.log("Total pages: " + String($this.total_pages));

                $this.current_page = 0;
                $this.setState({
                    rows: response.data.rows,
                    current_page: $this.current_page,
                    total_pages: $this.total_pages
                });
            },
            error: function (xhr, status, err) {
                console.error("AJAX search call failed");
                console.error(url, status, err.toString());
            }
        });
    }

    /*
        Build the base url
    */
    buildUrl() {
        let url = this.props.url;
        if (url.includes("?")) {
            url += "&";
        }
        else {
            url += "?";
        }
        url += "page=" + String(this.current_page);
        url += "&pagesize=" + String(this.page_size);
        // TODO Determine if sort col will be the index or the name
        url += "&sortcol=" + String(this.props.cols[this.sort_col].colname);
        url += "&sortdir=" + (this.sort_dir[this.sort_col] > 0 ? "asc" : "desc");
        if (this.search_arg.length) {
            url += "&search=" + this.search_arg;
        }
        console.log("Getting records from url " + url);
        return url;
    }

    // Sorts the table based on the given column index
    onSortColumn(i) {
        console.log("Sort column: " + String(i));
        // Flip the sort direction
        this.sort_dir[i] = SORT_INVERT * this.sort_dir[i];
        // Remember last sorted column
        this.sort_col = i;
        this.loadTable();
    }

    render() {
        const HeaderComponents = this.generateHeaders();
        const RowComponents = this.generateRows();
        const FooterComponents = this.generateFooter();
        const previousDisabled = this.state.current_page > 0 ? "" : "disabled";
        const nextDisabled = (this.state.current_page + 1) < this.state.total_pages ?
            "" : "disabled";
        let setPageSizeDisabled = "disabled";
        if ((this.state.page_size.length > 0) && (!isNaN(parseInt(this.state.page_size, 10)))) {
            setPageSizeDisabled = "";
        }

        return (
            <div className="">
                <div className="card-header">
                    <h2 className="card-title">{this.props.title}</h2>
                </div>
                <div className="card-body">
                    <table className={this.props.class}>
                        <thead>{HeaderComponents}</thead>
                        <tfoot>{FooterComponents}</tfoot>
                        <tbody>{RowComponents}</tbody>
                    </table>
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-md-9">
                            <button
                                type="button"
                                className={"btn-extra btn btn-primary btn-sm " + previousDisabled}
                                role="button"
                                onClick={this.onFirstPage}
                            >
                                First
                            </button>
                            <button
                                type="button"
                                className={"btn-extra btn btn-primary btn-sm " + previousDisabled}
                                role="button"
                                onClick={this.onPreviousPage}
                            >
                                Previous
                            </button>
                            <span>
                                Page {this.state.current_page + 1} of {this.state.total_pages}
                            </span>
                            <button
                                type="button"
                                className={"btn-extra btn btn-primary btn-sm " + nextDisabled}
                                role="button"
                                onClick={this.onNextPage}
                            >
                                Next
                            </button>
                            <button
                                type="button"
                                className={"btn-extra btn btn-primary btn-sm " + nextDisabled}
                                role="button"
                                onClick={this.onLastPage}
                            >
                                Last
                            </button>
                        </div>
                        <div className="col-md-3">
                            <button
                                type="button"
                                className={"btn-extra btn btn-primary pull-right btn-sm " +
                                    setPageSizeDisabled}
                                role="button"
                                onClick={this.onSetPageSize}
                            >
                                Page Size
                            </button>
                            <input
                                type="text"
                                className="textbox-sm pull-right"
                                id="page-size"
                                value={this.state.page_size}
                                onChange={this.pageSizeChanged}
                            />
                        </div>
                    </div>
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
                    </th>
                );
            }
            return (
                <th
                    key={colData.colname}
                >
                    {colData.label}
                </th>
            );
        }, this);

        // return a single header row
        return (
            <tr>
                {cells}
            <th>Actions</th>
            </tr>
        );
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
            return (
                <tr key={row.id}>
                    {cells}
                    {actions}
                </tr>
            );
        });
    }

    generateFooter() {
        return <tr><td>"Total Rows"</td><td>{this.state.rows.length}</td></tr>;
    }
}

PagedTable.propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    cols: PropTypes.arrayOf(PropTypes.object).isRequired,
    url: PropTypes.string.isRequired,
};

PagedTable.defaultProps = {
};
