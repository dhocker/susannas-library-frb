/*
    Susanna's Library edit category dialog box
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
import NewCategoryDialog from './new-category-dialog';
import * as callstack from './dialog-call-stack';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new author dialog box
const EDIT_CATEGORY_DLG_ID = "edit-category-jsx";

export default class EditCategoryDialog extends NewCategoryDialog {
    constructor(props) {
        super(props);
        const {row} = props;

        // Initial state
        this.state.nameValue = row.name;
        this.state.id = row.id;
        this.state.error = "";

        // Bind 'this' to various methods
        this.getHeader = this.getHeader.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitCategory = this.commitCategory.bind(this);
        this.initState = this.initState.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    initState(row) {
        this.setState({
            nameValue: row.name,
            id: row.id,
            error: "",
        });
    }

    /*
        Save category
    */
    onSave() {
        console.log("Saving category " + String(this.state.id) + " " + this.state.nameValue);

        // Validate fields
        this.setState({ error: "" });
        if (this.state.nameValue.length <= 0) {
            this.setState({error: "Name is blank"});
            return;
        }

        const data = {
            name: this.state.nameValue,
        };
        // The data object will be request.form on the server
        this.commitCategory(data);
    }

    /*
        Send category data to server
    */
    commitCategory(data) {
        // The data object will be request.form on the server
        const $this = this;
        const http_verb = "PUT";
        const url = "/category/" + String($this.state.id);
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function (result) {
                console.log(result);
                console.log("Category updated");
                // Refresh categories table to pick up the new record.
                // Fire series edit event
                $("#edit-category").trigger("frb.category.edit");
                // Manually close dialog
                $this.closeDialog(EDIT_CATEGORY_DLG_ID);
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                // TODO It would be nice if this were another dialog box
                $this.setState({error: "That category already exists"});
                // Note that the dialog box is left open so the user can fix the error
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
                    <img
                        className="dialog-logo"
                        alt="logo"
                        src="/static/book_pile2.jpg"
                    />
                    Edit Category
                </h1>
                <h2 style={{ color: "red" }}>
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
                    className="btn btn-default pull-left"
                    onClick={this.onSave}
                >
                    Save
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

EditCategoryDialog.propTypes = {
    id: PropTypes.string.isRequired,
    row: PropTypes.instanceOf(PropTypes.object).isRequired,
};

EditCategoryDialog.defaultProps = {
};

/*
    Initialize the edit series dialog box
*/
let editCategoryInstance;
export function editCategoryDialog(row) {
    if (editCategoryInstance) {
        editCategoryInstance.initState(row);
    }
    else {
        ReactDOM.render(
            <EditCategoryDialog
                id={EDIT_CATEGORY_DLG_ID}
                size="sm"
                row={row}
                ref={function (instance) {
                    editCategoryInstance = instance;
                }}
            />,
            document.querySelector('#edit-category')
        );
    }
    callstack.callDialog(EDIT_CATEGORY_DLG_ID);
}
