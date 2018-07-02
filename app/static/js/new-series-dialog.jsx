/*
    React + Bootstrap new series dialog box
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

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new author dialog box
export const NEW_SERIES_DLG_ID = "new-series-jsx";

export default class NewSeriesDialog extends ModalDialog {
    constructor(props) {
        super(props);

        // Initial state
        this.state.nameValue = "";
        this.state.error = "";

        // Bind 'this' to various methods
        this.clearFormFields = this.clearFormFields.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitSeries = this.commitSeries.bind(this);
    }

    /*
        Clear all form fields
    */
    clearFormFields() {
        this.setState({
            nameValue: "",
            error: ""
        });
        this.inputName.focus();
    }

    componentDidMount() {
        const $this = this;
        $("#" + $this.dialog_id).on('show.bs.modal', function () {
            // Trick to get focus into input text box
            setTimeout(function () {
                $this.inputName.focus();
                $this.inputName.select();
            }, 0);
        });
    }

    /*
        Add series
    */
    onAdd() {
        console.log(this.state.nameValue);

        // Validate fields
        this.setState({error: ""});
        if (this.state.nameValue.length <= 0) {
            this.setState({error: "Name is blank"});
            return;
        }

        /*
            There is a bit of an issue marshalling boolean values (try and avoid).
            While we are using JS booleans here, when they arrive at the server
            they will be string values :true" or "false".
        */
        const data = {
            name: this.state.nameValue,
        };
        // The data object will be request.form on the server
        this.commitSeries(data);
    }

    /*
        Send series data to server
    */
    commitSeries(data) {
        // The data object will be request.form on the server
        const $this = this;
        const http_verb = "POST";
        const url = "/series";
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function (result) {
                console.log(result);
                console.log("Series added");
                // Refresh series table to pick up the new record.
                // This is a bit of overkill but it is simple.
                // TODO Doesn't work. Thinks it's always used from the Series Page.
                $("#new-series").trigger("frb.series.add");
                // Manually close dialog
                $this.closeDialog(NEW_SERIES_DLG_ID);
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
        Control event handlers
    */
    nameChanged(event) {
        this.setState({
            nameValue: event.target.value,
            error: ""
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
                    New Series
                </h1>
                <h2 style={{color: "red"}}>
                    {error}
                </h2>
            </div>
        );
    }

    /*
        Override to customize the dialog body. For example, return
        a form element to build a form-in-a-dialog.
    */
    getBody() {
        return (
            <form id={this.props.id}>
                <div className="card">
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="input-name">
                                Series Name
                            </label>
                            <input
                                id="input-name"
                                type="text"
                                className="form-control"
                                ref={(instance) => {
                                    this.inputName = instance;
                                }}
                                value={this.state.nameValue}
                                onChange={this.nameChanged}
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            </form>
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
                    Add
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

NewSeriesDialog.propTypes = {
    id: PropTypes.string.isRequired,
};

NewSeriesDialog.defaultProps = {
};

/*
    Initialize the new series dialog box
*/
let newSeriesDialogInstance;
export function initNewSeriesDialog() {
    ReactDOM.render(
        <NewSeriesDialog
            id={NEW_SERIES_DLG_ID}
            size="md"
            ref={(instance) => {
                newSeriesDialogInstance = instance;
            }}
        />,
        document.querySelector('#new-series')
    );
}

/*
    Access point for clearing dialog fields
*/
export function clearNewSeriesDialog() {
    newSeriesDialogInstance.clearFormFields();
}
