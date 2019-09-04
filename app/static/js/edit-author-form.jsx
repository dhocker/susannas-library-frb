/*
    Susanna's Library
    Copyright © 2019  Dave Hocker (email: AtHomeX10@gmail.com)

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
import NewAuthorForm from "./new-author-form";
import $ from 'jquery';

export default class EditAuthorForm extends NewAuthorForm {
    constructor(props) {
        super(props);

        const {authorid} = props.match.params;

        // Initial state
        this.loadAuthor(authorid);

        // Bind 'this' to various methods
        this.onSave = this.onSave.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /*
        Save author
    */
    onSave() {
        // Validate fields
        if (!this.validateForm()) {
            return;
        }

        // Collect author data from form fields
        const data = this.marshalFormData();
        data.id = this.state.id;

        // The data object will be request.form on the server
        this.setState({message: ""});
        const url = "/author/" + String(data.id);
        this.commitAuthor("PUT", url, data);
    }

    loadAuthor(authorid) {
        const $this = this;
        const url = "/author/" + String(authorid);
        $.get(url, function (response /* , status */) {
            const {data} = response;

            $this.setState({
                lastnameValue: data.LastName,
                firstnameValue: data.FirstName,
                categoryValue: data.category_id,
                tryValue: !data.try_author === "",
                avoidValue: !data.Avoid === "",
                id: data.id,
                message: ""
            });
            // This actually updates the selected category
            $this.selectCategoryInstance.setSelectedCategory(data.category_id);
            $this.setFocus();
        })
    }

    // Catches the Enter key (which gets interpreted as a submit action)
    handleSubmit(event) {
        this.onSave();
        event.preventDefault();
    }

    getHeader() {
        return (
            <div className="card">
                <div className="row">
                    <h2 className="col-md-8">
                        Edit Author
                    </h2>
                </div>
            </div>
        );
    }

    getActionButtons() {
        return (
            <div className="card-footer">
                <div className="row">
                    <div className="col-md-12">
                        <button
                            type="submit"
                            className="btn btn-primary float-left"
                        >
                            Save
                        </button>
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
            <div className="container">
                <h2 className="text-danger">{this.state.message}</h2>
            </div>
        );
    }
}

NewAuthorForm.propTypes = {
};

NewAuthorForm.defaultProps = {
};
