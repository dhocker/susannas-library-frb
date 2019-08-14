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
import SelectCategory from './select-category';
import $ from 'jquery';

export default class EditAuthorForm extends NewAuthorForm {
    constructor(props) {
        super(props);

        const {authorid} = props.match.params;

        // Initial state
        this.loadAuthor(authorid);

        // Bind 'this' to various methods
        this.onSave = this.onSave.bind(this);
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

    componentDidMount() {
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

        // The data object will be request.form on the server
        this.setState({message: ""});
        this.commitAuthor(data);
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
        })
    }

    /*
        Send author data to server
    */
    commitAuthor(data) {
        // The data object will be request.form on the server
        const $this = this;
        const http_verb = "PUT";
        const url = "/author/" + String($this.state.id);
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function (result) {
                $this.setState({message: "Saved"});
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                $this.setState({message: xhr.responseText});
            }
        });
    }

    /*
        Control event handlers
    */
    firstnameChanged(event) {
        this.setState({
            firstnameValue: event.target.value,
            message: ""
        });
    }

    lastnameChanged(event) {
        this.setState({
            lastnameValue: event.target.value,
            message: ""
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

    render() {
        return (
            <div className="container">
                {this.getHeader()}
                {this.getBody()}
                {this.getFooter()}
            </div>
        );
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
            <div className="container">
                <h2 className="text-danger">{this.state.message}</h2>
                <button
                    type="button"
                    className="btn btn-primary float-left"
                    onClick={this.onSave}
                >
                    Save
                </button>
            </div>
        );
    }
}

NewAuthorForm.propTypes = {
};

NewAuthorForm.defaultProps = {
};
