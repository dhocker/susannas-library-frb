/*
    React + Bootstrap mew author dialog box
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
import * as authorstable from './authors-table';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new author dialog box
const NEW_AUTHOR_DLG_ID = "new-author-jsx";

export default class NewAuthorDialog extends ModalDialog {
    constructor(props) {
        super(props);
        // Initial state
        this.state = {
            lastnameValue: "",
            firstnameValue: "",
            categoryValue: "Mystery",
            tryValue: false,
            avoidValue: false,
            error: ""
        };

        // Bind 'this' to various methods
        this.clearFormFields = this.clearFormFields.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.firstnameChanged = this.firstnameChanged.bind(this);
        this.lastnameChanged = this.lastnameChanged.bind(this);
        this.categoryChanged = this.categoryChanged.bind(this);
        this.tryChanged = this.tryChanged.bind(this);
        this.avoidChanged = this.avoidChanged.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.getCategorySelect = this.getCategorySelect.bind(this);
        this.commitAuthor = this.commitAuthor.bind(this);
    }

    /*
        Clear all form fields
    */
    clearFormFields() {
        this.setState({
            lastnameValue: "",
            firstnameValue: "",
            categoryValue: "Mystery",
            tryValue: false,
            avoidValue: false,
            error: ""
        });
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
        Cancel the dialog
    */
    onCancel() {
        console.log("Dialog canceled");
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
        var data = {
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
        var $this = this;
        const http_verb = "POST";
        const url = "/author";
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function(result){
                console.log(result);
                console.log("Author added");
                // Refresh authors table to pick up the new record.
                // This is a bit of overkill but it is simple.
                authorstable.refreshAuthorsTable();
                // Manually close dialog
                $this.closeDialog(NEW_AUTHOR_DLG_ID);
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

    tryChanged(event) {
        this.setState({tryValue: !this.state.tryValue});
    }

    avoidChanged(event) {
        this.setState({avoidValue: !this.state.avoidValue});
    }

    handleCategoryChange(event) {
        this.setState({categoryValue: event.target.value});
    }

    /*
        Override to customize the dialog header (title)
        In this case, there is a simple error message embedded in the header
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h1 className="modal-title">New Author</h1>
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
                            <label for="lastname">Last Name</label>
                            <input id="lastname" type="text"  className="form-control"
                                value={this.state.lastnameValue} onChange={this.lastnameChanged}
                            />
                        </div>
                        <div className="form-group">
                            <label for="firstname">First Name</label>
                            <input id="firstname" type="text"  className="form-control"
                                value={this.state.firstnameValue} onChange={this.firstnameChanged}
                            />
                        </div>
                        <div className="form-group">
                            <label for={this.props.id + "-category"}>Category or Genre</label>
                            {this.getCategorySelect(this.props.id + "-category")}
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked={this.state.tryValue}
                                    onChange={this.tryChanged}
                                />Try
                            </label>
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked={this.state.avoidValue}
                                    onChange={this.avoidChanged}
                                />Avoid
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
                  <button type="button" className="btn btn-default pull-left"
                      onClick={this.onAdd}>Add</button>
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal"
                      onClick={this.onCancel}>Cancel</button>
            </div>
        );
    }

    /*
        Generate a select element for the categories
    */
    getCategorySelect(select_id) {
        var options_list = ["Mystery", "SciFi", "Fantasy", ""];
        var option_elements = options_list.map(function(optionValue) {
            return (
                <option key={optionValue} value={optionValue}>
                    {optionValue}
                </option>
            )
        });
        return (
            <select id={select_id}
                    className="form-control"
                    value={this.state.categoryValue}
                    onChange={this.handleCategoryChange}>
                {option_elements}
            </select>
        )
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

NewAuthorDialog.propTypes = {
    id: React.PropTypes.string.isRequired,
};

NewAuthorDialog.defaultProps = {
};

/*
    Initialize the new author dialog box
*/
var newAuthorDialogInstance;
export function initNewAuthorDialog() {
    newAuthorDialogInstance = ReactDOM.render(<NewAuthorDialog id={NEW_AUTHOR_DLG_ID} />,
        document.querySelector('#new-author'));
}

/*
    Access point for clearing dialog fields
*/
export function clearNewAuthorDialog() {
    newAuthorDialogInstance.clearFormFields();
}