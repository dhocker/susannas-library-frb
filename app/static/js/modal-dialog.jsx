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
import * as callstack from './dialog-call-stack';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

export default class ModalDialog extends React.Component {
    constructor(props) {
        super(props);

        // Dialog ID
        this.dialog_id = this.props.id;

        // Initial state
        this.state = {};

        // Bind 'this' to various methods
        this.onClose = this.onClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    /*
        Simple way to manually show the dialog
        Thid id is the dialog box, NOT the element it was rendered on
    */
    showDialog(id) {
        callStack.callDialog(id);
    }

    /*
        Simple way to manually close the dialog
        Thid id is the dialog box, NOT the element it was rendered on
    */
    closeDialog(id) {
        callstack.returnFromDialog();
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
        Override these stock events to handle dialog button clicks
    */

    onCancel() {
        console.log("Dialog canceled");
        this.closeDialog();
    }

    onClose() {
        console.log("Dialog closed");
    }

    /*
        Override to customize the dialog header (title)
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h4 className="modal-title">Modal Header</h4>
            </div>
        );
    }

    /*
        Override to customize the dialog body. For example, return
        a form element to build a form-in-a-dialog.
    */
    getBody() {
        return (
            <div className="modal-body">
                <p>Some text in the modal.</p>
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
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal"
                      onClick={this.onClose}>Close</button>
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal"
                      onClick={this.onCancel}>Cancel</button>
            </div>
        );
    }

    render() {
        return (
            <div id={this.dialog_id} className="modal" role="dialog">
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

ModalDialog.propTypes = {
    id: React.PropTypes.string.isRequired,
};

ModalDialog.defaultProps = {
};
