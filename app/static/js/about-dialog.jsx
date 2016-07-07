/*
    React + Bootstrap About dialog box
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
import * as callstack from './dialog-call-stack';

// This is the id of the element that contains the delete author dialog box
const ABOUT_DLG_ID = "about-jsx";

export default class AboutDialog extends ModalDialog {
    constructor(props) {
        super(props);
        this.state = {
            version: 'n/a'
        };

        // Bind 'this' to various methods
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
    }

    componentDidMount() {
        var $this = this;
        $.get("/about", function(response, status){
            var v = response.data;
            console.log(v.version);
            $this.setState({
                version: v.version
            });
        });
    }

    /*
        Override to customize the dialog header (title)
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h1 className="modal-title">
                    <img className="dialog-logo" src="/static/book_pile2.jpg"/>
                About Susanna's New Library</h1>
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
                    <p>All about Susanna's New Library</p>
                    <p>Version: {this.state.version}</p>
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
                      onClick={this.onCancel}>OK</button>
            </div>
        );
    }

    render() {
        return (
            <div id={this.props.id} className="modal" role="dialog">
                <div className="modal-dialog modal-md">
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

AboutDialog.propTypes = {
};

AboutDialog.defaultProps = {
};

export function initAboutDialog() {
    ReactDOM.render(<AboutDialog
        id={ABOUT_DLG_ID}
        />,
        document.querySelector('#about-dialog'));
}