/*
    React + Bootstrap mew series dialog box
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
import ModalDialog from './modal-dialog'
import * as seriestable from './series-table';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new author dialog box
const NEW_SERIES_DLG_ID = "new-series-jsx";

export default class NewSeriesDialog extends ModalDialog {
    constructor(props) {
        super(props);
        // Initial state
        this.state = {
            nameValue: "",
            error: ""
        };

        // Bind 'this' to various methods
        this.clearFormFields = this.clearFormFields.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onCancel = this.onCancel.bind(this);
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
    }

    componentDidMount() {
    }

    /*
        Cancel the dialog
    */
    onCancel() {
        console.log("Dialog canceled");
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
        var data = {
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
        var $this = this;
        const http_verb = "POST";
        const url = "/series";
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function(result){
                console.log(result);
                console.log("Series added");
                // Refresh series table to pick up the new record.
                // This is a bit of overkill but it is simple.
                seriestable.refreshSeriesTable();
                // Manually close dialog
                $this.closeDialog(NEW_SERIES_DLG_ID);
            },
            error: function(xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                // TODO It would be nice if this were another dialog box
                $this.setState({error: "That series already exists"});
                // Note that the dialog box is left open so the user can fix the error
            }
        })
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
        return (
            <div className="modal-header">
                <h1 className="modal-title">New Series</h1>
                <h2 style={{color:"red"}}>{this.state.error}</h2>
            </div>
        );
    }

    /*
        Override to customize the dialog body. For example, return
        a form element to build a form-in-a-dialog.
    */
    getBody() {
        return (
            <form id={this.props.id} role="form">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="form-group">
                            <label for="name">Series Name</label>
                            <input id="name" type="text"  className="form-control"
                                value={this.state.nameValue} onChange={this.nameChanged}
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
                  <button type="button" className="btn btn-default pull-left"
                      onClick={this.onAdd}>Add</button>
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal"
                      onClick={this.onCancel}>Cancel</button>
            </div>
        );
    }

    render() {
        return (
            <div id={this.props.id} className="modal" role="dialog">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        {this.getHeader()}
                        {this.getBody()}
                        {this.getFooter()}
                    </div>
                </div>
            </div>
        );
    }
}

NewSeriesDialog.propTypes = {
    id: React.PropTypes.string.isRequired,
};

NewSeriesDialog.defaultProps = {
};

/*
    Initialize the new series dialog box
*/
var newSeriesDialogInstance;
export function initNewSeriesDialog() {
    ReactDOM.render(<NewSeriesDialog
        id={NEW_SERIES_DLG_ID}
        ref={function(instance) {
            newSeriesDialogInstance = instance;
        }}
        />,
        document.querySelector('#new-series'));
}

/*
    Access point for clearing dialog fields
*/
export function clearNewSeriesDialog() {
    newSeriesDialogInstance.clearFormFields();
}