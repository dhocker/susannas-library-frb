/*
    React + Bootstrap modal dialog box
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
import Select from './select';
import * as authorstable from './authors-table';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

export default class NewAuthorDialog extends ModalDialog {
    constructor(props) {
        super(props);
        // Initial state
        this.state = {
            lastnameValue: "",
            firstnameValue: "",
            categoryValue: "Mystery",
            tryValue: false,
            avoidValue: false
        };

        // Bind 'this' to various methods
        this.onAdd = this.onAdd.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.firstnameChanged = this.firstnameChanged.bind(this);
        this.lastnameChanged = this.lastnameChanged.bind(this);
        this.categoryChanged = this.categoryChanged.bind(this);
        this.tryChanged = this.tryChanged.bind(this);
        this.avoidChanged = this.avoidChanged.bind(this);
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
        this.serverRequest = $.ajax({
            type: "PUT",
            url: "/author",
            data: data,
            success: function(result){
                console.log(result);
                console.log("Author added");
                // Refresh authors table to pick up the new record.
                // This is a bit of overkill but it is simple.
                authorstable.refreshAuthorsTable();
            }
        })
    }

    /*
        Control event handlers
    */
    firstnameChanged(event) {
        this.setState({firstnameValue: event.target.value});
    }

    lastnameChanged(event) {
        this.setState({lastnameValue: event.target.value});
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

    /*
        Override to customize the dialog header (title)
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h1 className="modal-title">New Author</h1>
            </div>
        );
    }

    /*
        Override to customize the dialog body. For example, return
        a form element to build a form-in-a-dialog.
    */
    getBody() {
        return (
            <form role="form">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="form-group">
                            <label for="firstname">First Name</label>
                            <input id="firstname" type="text"  className="form-control"
                                value={this.state.firstnameValue} onChange={this.firstnameChanged}
                            />
                        </div>
                        <div className="form-group">
                            <label for="lastname">Last Name</label>
                            <input id="lastname" type="text"  className="form-control"
                                value={this.state.lastnameValue} onChange={this.lastnameChanged}
                            />
                        </div>
                        <div className="form-group">
                            <label for="category">Category or Genre</label>
                            <Select id="category" class="form-control" options={["Mystery", "SciFi", "Fantasy"]}
                                defaultOption={"Mystery"}
                                onChange={this.categoryChanged}
                                />
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
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal"
                      onClick={this.onAdd}>Add</button>
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal"
                      onClick={this.onCancel}>Cancel</button>
            </div>
        );
    }

    render() {
        return (
            <div id={this.props.id} className="modal" role="dialog">
                <div className="modal-dialog modal-lg">
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
export function initNewAuthorDialog() {
    ReactDOM.render(<NewAuthorDialog id="new-author-jsx" />, document.querySelector('#new-author'));
}