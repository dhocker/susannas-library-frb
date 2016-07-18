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
import NewBookDialog from './new-book-dialog'
import * as bookstable from './books-table';
import * as callstack from './dialog-call-stack';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new author dialog box
const EDIT_BOOK_DLG_ID = "edit-book-jsx";

export default class EditBookDialog extends NewBookDialog {
    constructor(props) {
        super(props);
        // Initial state from props.row
        
        this.state.id = props.row.id;
        this.state.titleValue = props.row.Title;
        this.state.isbnValue = props.row.ISBN;
        this.state.volumeValue = props.row.Volume;
        this.state.seriesValue = props.row.series_id;
        this.state.authorValue = props.row.author_id ? props.row.author_id : 0;
        this.state.categoryValue = props.row.Category;
        this.state.statusValue = props.row.Status;
        this.state.coverValue = props.row.CoverType;
        this.state.notesValue = props.row.Notes;
        this.state.series_rows = [];
        this.state.author_rows = [];
        this.state.error = "";

        // Bind 'this' to various methods
        this.getHeader = this.getHeader.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitBook = this.commitBook.bind(this);
        this.initState = this.initState.bind(this);
    }

    initState(row) {
        console.log("EditBook init state");
        this.setState({
            titleValue: row.Title,
            isbnValue: row.ISBN,
            volumeValue: row.Volume,
            seriesValue: row.series_id,
            authorValue: row.author_id ? row.author_id : 0,
            categoryValue: row.Category,
            statusValue: row.Status,
            coverValue: row.CoverType,
            notesValue: row.Notes,
            id: row.id,
            error: ""
        });
    }

    componentDidMount() {
        // Load combo boxes
        var $this = this;
        $("#" + EDIT_BOOK_DLG_ID).on('show.bs.modal', function () {
            // Only load the tables once
            if ($this.state.author_rows.length == 0) {
                $this.loadAuthors();
            }
            if ($this.state.series_rows.length == 0) {
                $this.loadSeries();
            }
            if ($this.state.category_rows.length == 0) {
                $this.loadCategories();
            }
            $this.setFocus();
        });
    }

    /*
        Send author data to server
    */
    commitBook(data) {
        // The data object will be request.form on the server
        var $this = this;
        const http_verb = "PUT";
        var url = "/book/" + String($this.state.id);
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function(result){
                console.log(result);
                console.log("Book updated");
                // Refresh books table to pick up the new record.
                // Fire book edit event
                $("#edit-book").trigger("frb.book.edit");
                // Manually close dialog
                $this.closeDialog(EDIT_BOOK_DLG_ID);
            },
            error: function(xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                // TODO It would be nice if this were another dialog box
                $this.setState({error: errorThrown});
                // Note that the dialog box is left open so the user can see/fix the error
            }
        })
    }

    /*
        Override to customize the dialog header (title)
        In this case, there is a simple error message embedded in the header
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h1 className="modal-title">
                    <img className="dialog-logo" src="/static/book_pile2.jpg"/>
                Edit Book</h1>
                <h2 style={{color:"red"}}>{this.state.error}</h2>
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
                  <button type="button" className="btn btn-default pull-left"
                      onClick={this.onAdd}>Save</button>
                  <button type="button" className="btn btn-default pull-left"
                      onClick={this.onCancel}>Cancel</button>
            </div>
        );
    }
}

EditBookDialog.propTypes = {
    id: React.PropTypes.string.isRequired,
    row: React.PropTypes.object.isRequired
};

EditBookDialog.defaultProps = {
};

/*
    Initialize the edit book dialog box
*/
var editBookInstance;
export function editBookDialog(row) {
    if (editBookInstance) {
        editBookInstance.initState(row);
    }
    else {
        ReactDOM.render(<EditBookDialog
            id={EDIT_BOOK_DLG_ID}
            size={"md"}
            row={row}
            ref={function(instance) {
                editBookInstance = instance;
            }}
            />,
            document.querySelector('#edit-book'));
    }
    callstack.callDialog(EDIT_BOOK_DLG_ID);
}
