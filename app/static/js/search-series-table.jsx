/*
    Susanna's New Library
    Copyright © 2019  Dave Hocker (email: AtHomeX10@gmail.com)

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
import SeriesTable from './series-table';

export default class SearchSeriesTable extends SeriesTable {
    constructor(props) {
        super(props);

        // The initial title. It will change when the related record is loaded.
        this.state.title = props.title;
        // Initially, the search arg is the value passed to the component (encoded)
        this.searcharg = decodeURIComponent(this.props.searcharg);
        // This is the search arg entered in this component
        this.state.search_arg = "";

        // Function bindings
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidUpdate() {
        // Note that the props searcharg is encoded
        if (encodeURIComponent(this.searcharg) !== this.props.searcharg) {
            console.log("Reloading series because search arg changed");
            this.setState({
                search_url: "",
                search_arg: ""
            });
            this.loadTable();
            this.setFocus();
        }
    }

    onSearch() {
        // Use the currently entered search argument
        this.searcharg = this.state.search_arg;
        const new_title = "Series containing " + this.state.search_arg;
        this.setState({title: new_title});
        super.onSearch();
    }

    /*
        Build the URL for fetching series using a search
    */
    buildUrl() {
        let url = "/series?";
        url += "page=" + String(this.current_page);
        url += "&pagesize=" + String(this.page_size);
        // TODO Determine if sort col will be the index or the name
        url += "&sortcol=" + String(this.cols[this.sort_col].colname);
        url += "&sortdir=" + (this.sort_dir[this.sort_col] > 0 ? "asc" : "desc");
        if (this.searcharg.length) {
            // Note that the searcharg must be encoded to allow use of special characters
            url += "&search=" + encodeURIComponent(this.searcharg);
        }
        return url;
    }
}

SearchSeriesTable.propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    searcharg: PropTypes.string.isRequired,
};

SearchSeriesTable.defaultProps = {
};

export function renderSearchSeriesTable(props) {
    let title = "Series containing " + props.match.params.searcharg;

    return (
        <SearchSeriesTable
            class="table table-striped table-condensed"
            title={title}
            searcharg={props.match.params.searcharg}
        />
    );
}
