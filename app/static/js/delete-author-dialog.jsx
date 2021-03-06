/*
    React + Bootstrap delete author dialog box
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
const DELETE_AUTHOR_DLG_ID = "delete-author-jsx";

export default class DeleteAuthorDialog extends ModalDialog {
    constructor(props) {
        super(props);

        // Bind 'this' to various methods
        this.onDelete = this.onDelete.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
    }

    componentDidMount() {
        /*
        this.serverRequest = $.get(this.props.url, function(response, status){
            console.log("Data rows received: " + String(response.data.length));
            this.setState({rows: response.data});
        }.bind(this));
        */
    }

    /*
        Delete author
    */
    onDelete() {
        const $this = this;
        this.serverRequest = $.ajax({
            type: "DELETE",
            url: "/author/" + String(this.props.row.id),
            success: function (result) {
                console.log(result);
                // Refresh authors table to pick up the new record.
                // Fire author delete event
                $("#delete-author").trigger("frb.author.delete");
                $this.closeDialog(DELETE_AUTHOR_DLG_ID);
            }
        });
    }

    /*
        Override to customize the dialog header (title)
    */
    getHeader() {
        return (
            <div className="modal-header">
                <div className="">
                    <div className="">
                        <h1 className="modal-title">
                            <img className="dialog-logo" alt="logo" src="/static/book_pile2.jpg" />
                            Delete Author
                        </h1>
                    </div>
                    <div className="">
                        <h2 className="">
                            and ALL related books
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    /*
        Override to customize the dialog body. For example, return
        a form element to build a form-in-a-dialog.
    */
    getBody() {
        const {row} = this.props;
        return (
            <div className="card">
                <div className="card-body">
                    <div className="form-group">
                        <p>
                            <b>
                                id:&nbsp;
                            </b>
                            {row.id}
                        </p>
                        <p>
                            <b>
                                Last name:&nbsp;
                            </b>
                            {row.LastName}
                        </p>
                        <p>
                            <b>
                                First name:&nbsp;
                            </b>
                            {row.FirstName}
                        </p>
                        <p>
                            <b>
                                Category:&nbsp;
                            </b>
                            {row.category}
                        </p>
                        <p>
                            <b>
                                Try:&nbsp;
                            </b>
                            {row.try_author}
                        </p>
                        <p>
                            <b>
                                Avoid:&nbsp;
                            </b>
                            {row.Avoid}
                        </p>
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
                    className="btn btn-primary float-left"
                    data-dismiss="modal"
                    onClick={this.onDelete}
                >
                    Delete
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

DeleteAuthorDialog.propTypes = {
    row: PropTypes.instanceOf(PropTypes.object).isRequired,
};

DeleteAuthorDialog.defaultProps = {
};

/*
    Delete an author record given its table row
*/
export function deleteAuthor(row) {
    console.log("Attempting to create DeleteAuthorDialog");
    ReactDOM.render(<DeleteAuthorDialog id={DELETE_AUTHOR_DLG_ID} size="md" row={row} />,
        document.querySelector('#delete-author'));
    console.log("DeleteAuthorDialog created");
    callstack.callDialog(DELETE_AUTHOR_DLG_ID);
}
