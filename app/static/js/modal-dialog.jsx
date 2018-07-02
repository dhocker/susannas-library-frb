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
import PropTypes from 'prop-types';
import * as callstack from './dialog-call-stack';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

export default class ModalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        const {id} = this.props;

        // Dialog ID
        this.dialog_id = id;

        // Dialog box size
        let sizeClass = "modal-md";
        // size = sm, md, lg
        if (props.size) {
            sizeClass = "modal-" + props.size;
        }

        // Initial state
        this.state.sizeClass = sizeClass;

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
        callstack.callDialog(id);
    }

    /*
        Simple way to manually close the dialog
        Thid id is the dialog box, NOT the element it was rendered on
    */
    closeDialog() {
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
        this.closeDialog();
    }

    /*
        Override to customize the dialog header (title)
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h4 className="modal-title">
                    Modal Header
                </h4>
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
                <p>
                    Some text in the modal.
                </p>
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
                    data-dismiss="modal"
                    onClick={this.onClose}
                >
                Close
                </button>
                <button
                    type="button"
                    className="btn btn-default pull-left"
                    data-dismiss="modal"
                    onClick={this.onCancel}
                >
                Cancel
                </button>
            </div>
        );
    }

    render() {
        const {sizeClass} = this.state;
        return (
            <div id={this.dialog_id} className="modal fade" role="dialog">
                <div className={"modal-dialog " + sizeClass}>
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
    id: PropTypes.string.isRequired,
    size: PropTypes.string
};

ModalDialog.defaultProps = {
    size: ""
};
