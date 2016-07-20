/*
    Categories Table
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
import PagedTable from './paged-table';
import * as DeleteCategory from './delete-category-dialog';
import * as EditCategory from './edit-category-dialog';

/*
    Categories table - a specific instance of a table showing
    all of the series in the database.
*/
export default class CategoriesTable extends PagedTable {
    constructor(props) {
        super(props);

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        var $this = this;

        $this.loadTable();

        // On series add, reload table
        $("#new-category").on("frb.category.add", function (event) {
            console.log("On add event, reload categories");
            $this.loadTable();
        });

        // On category delete, reload table
        $("#delete-category").on("frb.category.delete", function (event) {
            console.log("On delete event, reload categories");
            $this.loadTable();
        });

        // On category edit, reload table
        $("#edit-category").on("frb.category.edit", function (event) {
            console.log("On edit event, reload categories");
            $this.loadTable();
        });
    }

    onBooksClick(row) {
        console.log("Books was clicked for id " + String(row.id));
        window.location.href = "/paged-books-page?category=" + String(row.id);
    }

    onAuthorsClick(row) {
        console.log("Authors was clicked for id " + String(row.id));
        //window.location.href = "/authors-page?category=" + String(row.id);
    }

    onEditClick(row) {
        console.log("Edit was clicked for id " + String(row.id));
        EditCategory.editCategoryDialog(row);
    }

    onDeleteClick(row) {
        console.log("Delete was clicked for id " + String(row.id));
        // Fire up the delete dialog box
        DeleteCategory.deleteCategory(row);
    }

    // Generate the actions for categories
    getActions(row) {
        return (
            <td>
                <a href="#" onClick={this.onAuthorsClick.bind(this, row)}>Authors</a>
                <a href="#" onClick={this.onBooksClick.bind(this, row)}>Books</a>
                <a href="#" onClick={this.onEditClick.bind(this, row)}>Edit</a>
                <a href="#" onClick={this.onDeleteClick.bind(this, row)}>Delete</a>
            </td>
        )
    }
}

CategoriesTable.propTypes = {
    title: React.PropTypes.string.isRequired,
    class: React.PropTypes.string.isRequired,
    cols: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired
};

CategoriesTable.defaultProps = {
};

/*
    Create the categories table instance on the series page
*/
var categoriesTableInstance;
export function createCategoriesTable() {
    // Defines the columns in the categories table
    var categoriesTableColumns = [
        { colname: 'name', label: 'Name', sortable: true },
        { colname: 'id', label: 'ID', sortable: true }
    ];

    console.log("Attempting to create Categories table");
    // Note that the ref attribute is the preferred way to capture the rendered instance
    ReactDOM.render(<CategoriesTable class={"table table-striped table-condensed"}
        title={"Categories"}
        cols={categoriesTableColumns}
        url={"/categories"}
        ref={function(instance) {
            categoriesTableInstance = instance;
        }}
        />,
        document.querySelector('#categoriestable')
    );
    console.log("Categories table created");
}

/*
    Load categories table based on search/filter
*/
export function searchCategories(arg) {
    categoriesTableInstance.filterTable(arg);
}