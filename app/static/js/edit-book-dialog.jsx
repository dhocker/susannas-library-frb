/*
    React + Bootstrap edit book dialog box
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
import NewBookDialog from './new-book-dialog';
import * as callstack from './dialog-call-stack';

// This is the id of the element that contains the new author dialog box
const EDIT_BOOK_DLG_ID = "edit-book-jsx";

export default class EditBookDialog extends NewBookDialog {
    constructor(props) {
        super(props);
        const {row} = props;

        // Initial state from props.row
        this.row = row;
        this.state.id = row.id;
        this.state.titleValue = row.Title;
        this.state.isbnValue = row.ISBN;
        this.state.volumeValue = row.Volume;
        this.state.seriesValue = row.series_id;
        this.state.authorValue = row.author_id ? row.author_id : 0;
        this.state.categoryValue = row.category_id;
        this.state.statusValue = row.Status;
        this.state.coverValue = row.CoverType;
        this.state.notesValue = row.Notes;
        this.state.series_rows = [];
        this.state.author_rows = [];
        this.state.error = "";

        // Bind 'this' to various methods
        this.getHeader = this.getHeader.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitBook = this.commitBook.bind(this);
        this.initState = this.initState.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    initState(row) {
        console.log("EditBook init state");
        console.log("EditBook init state categoryValue: " + String(row.category_id));
        this.row = row;
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
            error: "",
        });
    }

    componentDidMount() {
        // Load combo boxes
        const $this = this;
        $("#" + EDIT_BOOK_DLG_ID).on('show.bs.modal', function () {
            // Only load the tables once
            if ($this.state.author_rows.length === 0) {
                $this.loadAuthors();
            }
            if ($this.state.series_rows.length === 0) {
                $this.loadSeries();
            }
            // Make sure category is correctly selected
            // When we get here, the effects of initState (and its setState) have not been applied
            // to the state property. Therefore, we use the row property to avoid
            // the indeterminate nature of setState.
            console.log("edit book categoryValue: " + String($this.row.category_id));
            $this.selectCategoryInstance.setSelectedCategory($this.row.category_id);
            // Put the cursor in the first text box
            $this.setFocus();
        });
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
                // Refresh books table to pick up the new record.
                // Fire book edit event
                $("#edit-book").trigger("frb.book.edit");
                // Manually close dialog
                $this.closeDialog(EDIT_BOOK_DLG_ID);
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                // TODO It would be nice if this were another dialog box
                $this.setState({error: errorThrown});
                // Note that the dialog box is left open so the user can see/fix the error
            }
        });
    }

    /*
        Override to customize the dialog header (title)
        In this case, there is a simple error message embedded in the header
    */
    getHeader() {
        const {error} = this.state;
        return (
            <div className="modal-header">
                <h1 className="modal-title">
                    <img className="dialog-logo" alt="logo" src="/static/book_pile2.jpg" />
                    Edit Book
                </h1>
                <h2 style={{color: "red"}}>
                    {error}
                </h2>
            </div>
        );
    }

    /*
        Override to customize the footer including action buttons.
        The stock buttons are Close and Cancel.
    */
    getFooter() {
        return (
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-primary float-left"
                    onClick={this.onAdd}
                >
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-primary float-left"
                    onClick={this.onCancel}
                >
                    Cancel
                </button>
            </div>
        );
    }
}

EditBookDialog.propTypes = {
    id: PropTypes.string.isRequired,
    row: PropTypes.instanceOf(PropTypes.object).isRequired
};

EditBookDialog.defaultProps = {
};

/*
    Initialize the edit book dialog box
*/
let editBookInstance;
export function editBookDialog(row) {
    if (editBookInstance) {
        editBookInstance.initState(row);
    }
    else {
        ReactDOM.render(
            <EditBookDialog
                id={EDIT_BOOK_DLG_ID}
                size="lg"
                row={row}
                ref={(instance) => {
                    editBookInstance = instance;
                }}
            />,
            document.querySelector('#edit-book')
        );
    }
    callstack.callDialog(EDIT_BOOK_DLG_ID);
}
