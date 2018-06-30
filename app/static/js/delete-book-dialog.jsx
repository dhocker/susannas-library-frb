/*
    React + Bootstrap delete book dialog box
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
import ModalDialog from './modal-dialog';
import * as callstack from './dialog-call-stack';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the delete author dialog box
const DELETE_BOOK_DLG_ID = "delete-book-jsx";

export default class DeleteBookDialog extends ModalDialog {
    constructor(props) {
        super(props);

        // Bind 'this' to various methods
        this.onDelete = this.onDelete.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
    }

    componentDidMount() {
    }

    /*
        Delete book
    */
    onDelete() {
        const $this = this;
        this.serverRequest = $.ajax({
            type: "DELETE",
            url: "/book/" + String(this.props.row.id),
            success: function (result) {
                console.log(result);
                // Refresh books table to pick up the new record.
                // Fire book deleted event
                $("#delete-book").trigger("frb.delete.book");
                $this.closeDialog(DELETE_BOOK_DLG_ID);
            }
        });
    }

    /*
        Override to customize the dialog header (title)
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h1 className="modal-title">
                    <img className="dialog-logo" alt="logo" src="/static/book_pile2.jpg" />
                Delete Book</h1>
            </div>
        );
    }

    /*
        Override to customize the dialog body. For example, return
        a form element to build a form-in-a-dialog.
    */
    getBody() {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <div className="form-group">
                        <p><b>id:</b> {this.props.row.id}</p>
                        <p><b>Title:</b> {this.props.row.Title}</p>
                        <p><b>Volume:</b> {this.props.row.Volume}</p>
                        <p><b>Series:</b> {this.props.row.Series}</p>
                        <p><b>Author:</b> {this.props.row.Author}</p>
                        <p><b>Category:</b> {this.props.row.Category}</p>
                        <p><b>Status:</b> {this.props.row.Status}</p>
                        <p><b>Cover:</b> {this.props.row.CoverType}</p>
                        <p><b>Notes:</b> {this.props.row.Notes}</p>
                    </div>
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
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-default pull-left"
                    onClick={this.onDelete}
                >
                    Delete
                </button>
                <button
                    type="button"
                    className="btn btn-default pull-left"
                    onClick={this.onCancel}
                >
                    Cancel
                </button>
            </div>
        );
    }
}

DeleteBookDialog.propTypes = {
    row: PropTypes.object.isRequired,
};

DeleteBookDialog.defaultProps = {
};

/*
    Delete an book record given its table row
*/
export function deleteBook(row) {
    console.log("Attempting to create DeleteBookDialog");
    ReactDOM.render(
        <DeleteBookDialog
            id={DELETE_BOOK_DLG_ID}
            size={"sm"} row={row}
        />,
        document.querySelector('#delete-book')
    );
    console.log("DeleteBookDialog created");
    callstack.callDialog(DELETE_BOOK_DLG_ID);
}
