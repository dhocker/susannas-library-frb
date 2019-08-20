/*
    React + Bootstrap edit book form
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
import NewBookForm from './new-book-form';
import $ from 'jquery';

export default class EditBookForm extends NewBookForm {
    constructor(props) {
        super(props);

        // Bind 'this' to various methods
        this.getHeader = this.getHeader.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitBook = this.commitBook.bind(this);
        this.initState = this.initState.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    initState(row) {
        this.setState({
            titleValue: row.Title,
            isbnValue: row.ISBN,
            volumeValue: row.Volume,
            seriesValue: row.series_id,
            authorValue: row.author_id ? row.author_id : 0,
            categoryValue: row.category_id,
            statusValue: row.Status,
            coverValue: row.CoverType,
            notesValue: row.Notes,
            id: row.id,
            message: "",
        });
    }

    componentDidMount() {
        const {bookid} = this.props.match.params;
        this.loadBook(bookid);
        // Load combo boxes
        this.loadAuthors();
        this.loadSeries();
    }

    loadBook(bookid) {
        const $this = this;
        const url = "/book/" + String(bookid);
        $.get(url, function (response /* , status */) {
            const row = response.data;
            $this.initState(row);
            // This actually updates the selected category
            $this.selectCategoryInstance.setSelectedCategory(row.category_id);
            $this.setFocus();
        })
    }

    /*
        Send author data to server
    */
    commitBook(data) {
        // The data object will be request.form on the server
        const $this = this;
        const http_verb = "PUT";
        const url = "/book/" + String($this.state.id);
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function (result) {
                console.log(result);
                console.log("Book updated");
                $this.setState({message: "Book saved"});
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                // TODO It would be nice if this were another dialog box
                $this.setState({message: errorThrown});
                // Note that the dialog box is left open so the user can see/fix the error
            }
        });
    }

    /*
        Override to customize the form header (title)
        In this case, there is a simple error message embedded in the header
    */
    getHeader() {
        return (
            <div className="card">
                <div className="row">
                    <h2 className="col-md-8">
                        Edit Book
                    </h2>
                </div>
            </div>
        );
    }

    /*
        Override to customize the footer including action buttons.
        The stock buttons are Close and Cancel.
    */
    getFooter() {
        return (
            <div className="container">
                <h2 className="text-danger">{this.state.message}</h2>
                <button
                    type="button"
                    className="btn btn-primary float-left"
                    onClick={this.onAdd}
                >
                    Save
                </button>
            </div>
        );
    }
}

EditBookForm.propTypes = {
};

EditBookForm.defaultProps = {
};
