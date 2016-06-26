/*
    React + Bootstrap edit author dialog box
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
import NewAuthorDialog from './new-author-dialog'
import * as authorstable from './authors-table';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new author dialog box
const EDIT_AUTHOR_DLG_ID = "edit-author-jsx";

export default class EditAuthorDialog extends NewAuthorDialog {
    constructor(props) {
        super(props);
        // Initial state
        this.state = {
            lastnameValue: props.row.LastName,
            firstnameValue: props.row.FirstName,
            categoryValue: props.row.category,
            tryValue: !props.row.try_author == "",
            avoidValue: !props.row.Avoid == "",
            id: props.row.id,
            error: ""
        };

        // Bind 'this' to various methods
        this.getHeader = this.getHeader.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitAuthor = this.commitAuthor.bind(this);
        this.initState = this.initState.bind(this);
    }

    initState(row) {
        this.setState({
            lastnameValue: row.LastName,
            firstnameValue: row.FirstName,
            categoryValue: row.category,
            tryValue: !row.try_author == "",
            avoidValue: !row.Avoid == "",
            id: row.id,
            error: ""
        });
    }

    /*
        Send author data to server
    */
    commitAuthor(data) {
        // The data object will be request.form on the server
        var $this = this;
        const http_verb = "PUT";
        var url = "/author/" + String($this.state.id);
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function(result){
                console.log(result);
                console.log("Author updated");
                // Refresh authors table to pick up the new record.
                // This is a bit of overkill but it is simple.
                authorstable.refreshAuthorsTable();
                // Manually close dialog
                $this.closeDialog(EDIT_AUTHOR_DLG_ID);
            },
            error: function(xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                // TODO It would be nice if this were another dialog box
                $this.setState({error: "That author already exists"});
                // Note that the dialog box is left open so the user can fix the error
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
                <h1 className="modal-title">Edit Author</h1>
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
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal"
                      onClick={this.onCancel}>Cancel</button>
            </div>
        );
    }
}

EditAuthorDialog.propTypes = {
    id: React.PropTypes.string.isRequired,
    row: React.PropTypes.object.isRequired
};

EditAuthorDialog.defaultProps = {
};

/*
    Initialize the edit author dialog box
*/
var editAuthorInstance;
export function editAuthorDialog(row) {
    if (editAuthorInstance) {
        editAuthorInstance.initState(row);
    }
    else {
        ReactDOM.render(<EditAuthorDialog
            id={EDIT_AUTHOR_DLG_ID}
            row={row}
            ref={function(instance) {
                editAuthorInstance = instance;
            }}
            />,
            document.querySelector('#edit-author'));
    }
    $("#" + EDIT_AUTHOR_DLG_ID).modal("show");
}
