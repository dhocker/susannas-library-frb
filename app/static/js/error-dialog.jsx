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

// This is the id of the element that contains the error dialog box
const ERROR_DLG_ID = "error-dialog-jsx";

export default class ErrorDialog extends ModalDialog {
    constructor(props) {
        super(props);
        // Initial state
        this.state = {};

        // Bind 'this' to various methods
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
    }

    /*
        Override to customize the dialog header (title)
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h1 className="modal-title">Error</h1>
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
                <p>{this.props.message}</p>
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
                  <button type="button" className="btn btn-danger pull-left" data-dismiss="modal"
                      >Close</button>
            </div>
        );
    }

}

ErrorDialog.propTypes = {
    id: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired
};

ErrorDialog.defaultProps = {
};

/*
    Fire error dialog
*/
export function showErrorDialog(message) {
    var dialogInstance;
    if (dialogInstance) {
        dialogInstance.showDialog(ERROR_DLG_ID);
    }
    else {
        ReactDOM.render(<ErrorDialog
            id={ERROR_DLG_ID}
            message={message}
            ref={function(instance) {
                dialogInstance = instance;
                dialogInstance.showDialog(ERROR_DLG_ID);
            }}
            />,
            document.querySelector('#error-dialog'));
    }
}
