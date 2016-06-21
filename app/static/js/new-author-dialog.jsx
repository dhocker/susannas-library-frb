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

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

export default class NewAuthorDialog extends ModalDialog {
    constructor(props) {
        super(props);
        // Initial state
        this.state = {};

        // Bind 'this' to various methods
        this.onClose = this.onClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
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

    onCancel() {
        console.log("Dialog canceled");
    }

    /*
        Add author
    */
    onClose() {
        console.log("Author added");
        console.log(this.state);
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
                            <input id="firstname" type="text"  className="form-control" />
                        </div>
                        <div className="form-group">
                            <label for="lastname">Last Name</label>
                            <input id="lastname" type="text"  className="form-control" />
                        </div>
                        <div className="form-group">
                            <label for="category">Category or Genre</label>
                            <Select id="category" class="form-control" options={["s1", "s2", "s3"]}
                                defaultOption={"s3"} />
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked={this.state.tryValue}
                                />Try
                            </label>
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked={this.state.avoidValue}
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
                      onClick={this.onClose}>Add</button>
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
