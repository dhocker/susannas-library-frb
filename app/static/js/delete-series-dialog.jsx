/*
    React + Bootstrap delete series dialog box
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
import * as seriestable from './series-table';
import * as callstack from './dialog-call-stack';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the delete author dialog box
const DELETE_SERIES_DLG_ID = "delete-series-jsx";

export default class DeleteSeriesDialog extends ModalDialog {
    constructor(props) {
        super(props);

        // Bind 'this' to various methods
        this.onDelete = this.onDelete.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
    }

    componentDidMount() {
    }

    /*
        Delete series
    */
    onDelete() {
        var $this = this;
        this.serverRequest = $.ajax({
            type: "DELETE",
            url: "/series/" + String(this.props.row.id),
            success: function(result){
                console.log(result);
                // Refresh series table to pick up the new record.
                // This is a bit of overkill but it is simple.
                seriestable.refreshSeriesTable();
                $this.closeDialog(DELETE_SERIES_DLG_ID);
            }
        })
    }

    /*
        Override to customize the dialog header (title)
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h1 className="modal-title">
                    <img className="dialog-logo" src="/static/book_pile2.jpg"/>
                Delete Series</h1>
            </div>
        );
    }

    /*
        Override to customize the dialog body. For example, return
        a form element to build a form-in-a-dialog.
    */
    getBody() {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <div className="form-group">
                        <p><b>id:</b> {this.props.row.id}</p>
                        <p><b>Name:</b> {this.props.row.name}</p>
                    </div>
                </div>
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
                  <button type="button" className="btn btn-default pull-left"
                      onClick={this.onDelete}>Delete</button>
                  <button type="button" className="btn btn-default pull-left"
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

DeleteSeriesDialog.propTypes = {
    row: React.PropTypes.object.isRequired,
};

DeleteSeriesDialog.defaultProps = {
};

/*
    Delete an series record given its table row
*/
export function deleteSeries(row) {
    console.log("Attempting to create DeleteSeriesDialog");
    ReactDOM.render(<DeleteSeriesDialog id={DELETE_SERIES_DLG_ID} row={row}/>, document.querySelector('#delete-series'));
    console.log("DeleteSeriesDialog created");
    callstack.callDialog(DELETE_SERIES_DLG_ID);
}
