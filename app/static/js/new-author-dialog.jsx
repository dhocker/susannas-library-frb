/*
    Susanna's Library
    Copyright (C) 2016, 2019  Dave Hocker (email: AtHomeX10@gmail.com)

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
import SelectCategory from './select-category';
import * as errordlg from './error-dialog';
import $ from 'jquery';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new author dialog box
const NEW_AUTHOR_DLG_ID = "new-author-jsx";

export default class NewAuthorDialog extends ModalDialog {
    constructor(props) {
        super(props);
        // Initial state

        this.state.lastnameValue = "";
        this.state.firstnameValue = "";
        this.state.categoryValue = 1;
        this.state.tryValue = false;
        this.state.avoidValue = false;
        this.state.error = "";

        // Bind 'this' to various methods
        this.clearFormFields = this.clearFormFields.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.firstnameChanged = this.firstnameChanged.bind(this);
        this.lastnameChanged = this.lastnameChanged.bind(this);
        this.categoryChanged = this.categoryChanged.bind(this);
        this.tryChanged = this.tryChanged.bind(this);
        this.avoidChanged = this.avoidChanged.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitAuthor = this.commitAuthor.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    /*
        Clear all form fields
    */
    clearFormFields() {
        this.setState({
            lastnameValue: "",
            firstnameValue: "",
            categoryValue: 1,
            tryValue: false,
            avoidValue: false,
            error: ""
        });

        // Reset the categories combo box to its default value
        this.selectCategoryInstance.resetSelectedCategory();
    }

    componentDidMount() {
        const $this = this;
        $("#" + $this.dialog_id).on('shown.bs.modal', function () {
            $this.selectCategoryInstance.setSelectedCategory($this.state.categoryValue);
            // Trick to get focus into input text box
            setTimeout(function () {
                $this.lastName.focus();
                $this.lastName.select();
            }, 0);
        });
    }

    /*
        Add author
    */
    onAdd() {
        console.log(this.state.firstnameValue);
        console.log(this.state.lastnameValue);
        console.log(this.state.categoryValue);
        console.log(this.state.tryValue);
        console.log(this.state.avoidValue);

        // Validate fields
        this.setState({error: ""});
        if (this.state.lastnameValue.length <= 0) {
            this.setState({error: "Last Name is blank"});
            return;
        }
        if (this.state.firstnameValue.length <= 0) {
            this.setState({error: "First Name is blank"});
            return;
        }
        if (this.state.categoryValue.length <= 0) {
            this.setState({error: "Category is blank"});
            return;
        }

        /*
            There is a bit of an issue marshalling boolean values (try and avoid).
            While we are using JS booleans here, when they arrive at the server
            they will be string values :true" or "false".
        */
        const data = {
            firstname: this.state.firstnameValue,
            lastname: this.state.lastnameValue,
            category: this.state.categoryValue,
            try: this.state.tryValue,
            avoid: this.state.avoidValue
        };
        // The data object will be request.form on the server
        this.commitAuthor(data);
    }

    /*
        Send author data to server
    */
    commitAuthor(data) {
        // The data object will be request.form on the server
        const $this = this;
        const http_verb = "POST";
        const url = "/author";
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function (result) {
                console.log(result);
                console.log("Author added");
                // Refresh authors table to pick up the new record.
                // Fire event for new author added
                $("#new-author").trigger("frb.author.add");
                // Manually close dialog
                $this.closeDialog(NEW_AUTHOR_DLG_ID);
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                const errormsg = "That author already exists: " + $this.state.lastnameValue
                    + ", " + $this.state.firstnameValue;
                errordlg.showErrorDialog("Duplicate Author", errormsg);
                // Note that the dialog box is left open so the user can fix the error
            }
        });
    }

    /*
        Control event handlers
    */
    firstnameChanged(event) {
        this.setState({
            firstnameValue: event.target.value,
            error: ""
        });
    }

    lastnameChanged(event) {
        this.setState({
            lastnameValue: event.target.value,
            error: ""
        });
    }

    categoryChanged(event) {
        this.setState({categoryValue: event.newValue});
    }

    tryChanged(/* event */) {
        const {tryValue} = this.state;
        this.setState({tryValue: !tryValue});
    }

    avoidChanged(/* event */) {
        const {avoidValue} = this.state;
        this.setState({avoidValue: !avoidValue});
    }

    handleCategoryChange(event) {
        this.setState({categoryValue: event.target.value});
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
                    New Author
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
                            <label htmlFor="lastname">
                                Last Name
                            </label>
                            <input
                                id="lastname"
                                type="text"
                                className="form-control"
                                ref={(instance) => {
                                    this.lastName = instance;
                                }}
                                value={this.state.lastnameValue}
                                onChange={this.lastnameChanged}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstname">
                                First Name
                            </label>
                            <input
                                id="firstname"
                                type="text"
                                className="form-control"
                                value={this.state.firstnameValue}
                                onChange={this.firstnameChanged}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor={this.props.id + "-category"}>
                                Category or Genre
                            </label>
                            <SelectCategory
                                id={this.props.id + "-category"}
                                onChange={this.categoryChanged}
                                ref={(instance) => {
                                    this.selectCategoryInstance = instance;
                                }}
                            />
                        </div>
                        <div className="checkbox">
                            <label htmlFor="try-changed">
                                <input
                                    id="try-changed"
                                    type="checkbox"
                                    checked={this.state.tryValue}
                                    onChange={this.tryChanged}
                                />
                                Try
                            </label>
                        </div>
                        <div className="checkbox">
                            <label htmlFor="avoid">
                                <input
                                    id="avoid"
                                    type="checkbox"
                                    checked={this.state.avoidValue}
                                    onChange={this.avoidChanged}
                                />
                                Avoid
                            </label>
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

NewAuthorDialog.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.string
};

NewAuthorDialog.defaultProps = {
};

/*
    Initialize the new author dialog box
*/
let newAuthorDialogInstance;
export function initNewAuthorDialog() {
    ReactDOM.render(
        <NewAuthorDialog
            id={NEW_AUTHOR_DLG_ID}
            size="md"
            ref={(instance) => {
                newAuthorDialogInstance = instance;
            }}
        />,
        document.querySelector('#new-author')
    );
}

/*
    Access point for clearing dialog fields
*/
export function clearNewAuthorDialog() {
    newAuthorDialogInstance.clearFormFields();
}
