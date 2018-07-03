/*
    React + Bootstrap edit series dialog box
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
import NewSeriesDialog from './new-series-dialog';
import * as callstack from './dialog-call-stack';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new author dialog box
const EDIT_SERIES_DLG_ID = "edit-series-jsx";

export default class EditSeriesDialog extends NewSeriesDialog {
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
        this.commitSeries = this.commitSeries.bind(this);
        this.initState = this.initState.bind(this);
    }

    initState(row) {
        this.setState({
            nameValue: row.name,
            id: row.id,
            error: "",
        });
    }

    /*
        Send series data to server
    */
    commitSeries(data) {
        // The data object will be request.form on the server
        const $this = this;
        const http_verb = "PUT";
        const url = "/series/" + String($this.state.id);
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function (result) {
                console.log(result);
                console.log("Series updated");
                // Refresh series table to pick up the new record.
                // Fire series edit event
                $("#edit-series").trigger("frb.series.edit");
                // Manually close dialog
                $this.closeDialog(EDIT_SERIES_DLG_ID);
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                // TODO It would be nice if this were another dialog box
                $this.setState({error: "That series already exists"});
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
                    <img className="dialog-logo" alt="logo" src="/static/book_pile2.jpg" />
                    Edit Series
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

EditSeriesDialog.propTypes = {
    id: PropTypes.string.isRequired,
    row: PropTypes.object.isRequired,
};

EditSeriesDialog.defaultProps = {
};

/*
    Initialize the edit series dialog box
*/
let editSeriesInstance;
export function editSeriesDialog(row) {
    if (editSeriesInstance) {
        editSeriesInstance.initState(row);
    }
    else {
        ReactDOM.render(
            <EditSeriesDialog
                id={EDIT_SERIES_DLG_ID}
                size="md"
                row={row}
                ref={function (instance) {
                    editSeriesInstance = instance;
                }}
            />,
            document.querySelector('#edit-series')
        );
    }
    callstack.callDialog(EDIT_SERIES_DLG_ID);
}
