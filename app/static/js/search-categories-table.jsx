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
import CategoriesTable from './categories-table';

export default class SearchCategoriesTable extends CategoriesTable {
    constructor(props) {
        super(props);

        // The initial title. It will change when the related record is loaded.
        this.state.title = props.title;
        // Initially, the search arg is the value passed to the component (encoded)
        this.searcharg = decodeURIComponent(this.props.searcharg);
        // This is the search arg entered in this component
        this.state.search_arg = "";
        // Table load is needed
        this.loadRequired = true;

        // Function bindings
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidUpdate() {
        // Note that the props searcharg is encoded
        if (this.loadRequired) {
            this.loadRequired = false;
            console.log("Reloading categories because search arg changed");
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
        const new_title = `Series containing "${this.state.search_arg}"`;
        this.setState({title: new_title});
        this.loadRequired = true;
        super.onSearch();
    }

    /*
        Build the URL for fetching categories using a search
    */
    buildUrl() {
        let url = "/categories?";
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

SearchCategoriesTable.propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    searcharg: PropTypes.string.isRequired,
};

SearchCategoriesTable.defaultProps = {
};

export function renderSearchCategoriesTable(props) {
    let title = `Categories containing "${props.match.params.searcharg}"`;

    return (
        <SearchCategoriesTable
            class="table table-striped table-condensed"
            title={title}
            searcharg={props.match.params.searcharg}
        />
    );
}