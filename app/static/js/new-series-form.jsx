/*
    New series form
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
import $ from 'jquery';

export default class NewSeriesForm extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            nameValue: "",
            message: ""
        };

        // Bind 'this' to various methods
        this.clearFormFields = this.clearFormFields.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitSeries = this.commitSeries.bind(this);
    }

    /*
        Clear all form fields
    */
    clearFormFields() {
        this.setState({
            nameValue: "",
            message: ""
        });
        this.setFocus();
    }

    componentDidMount() {
        this.setFocus();
    }

    setFocus() {
        const $this = this;
        // Trick to get focus into input text box
        setTimeout(function () {
            $this.inputName.focus();
            $this.inputName.select();
        }, 0);
    }

    /*
        Add series
    */
    onAdd() {
        console.log(this.state.nameValue);

        // Validate fields
        this.setState({error: ""});
        if (this.state.nameValue.length <= 0) {
            this.setState({message: "Name is blank"});
            return;
        }

        /*
            There is a bit of an issue marshalling boolean values (try and avoid).
            While we are using JS booleans here, when they arrive at the server
            they will be string values :true" or "false".
        */
        const data = {
            name: this.state.nameValue,
        };
        // The data object will be request.form on the server
        this.commitSeries("POST", "/series", data);
    }

    /*
        Send series data to server
    */
    commitSeries(http_verb, url, data) {
        // The data object will be request.form on the server
        const $this = this;
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function (result) {
                console.log(result);
                if (http_verb === "POST") {
                    console.log("Series added");
                    $this.setState({message: "Series added"});
                }
                else {
                    console.log("Series saved");
                    $this.setState({message: "Series saved"});
                }
           },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                const errormsg = "That series already exists: " + $this.state.nameValue;
                $this.setState({message: errormsg});
            }
        });
    }

    /*
        Control event handlers
    */
    nameChanged(event) {
        this.setState({
            nameValue: event.target.value,
            message: ""
        });
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
                        New Series
                    </h2>
                </div>
            </div>
        );
    }

    getBody() {
        return (
            <form id="new-series-jsx">
                <div className="card">
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="input-name">
                                Series Name
                            </label>
                            <input
                                id="input-name"
                                type="text"
                                className="form-control"
                                ref={(instance) => {
                                    this.inputName = instance;
                                }}
                                value={this.state.nameValue}
                                onChange={this.nameChanged}
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    getFooter() {
        return (
            <div className="container">
                <h2 className="text-danger">{this.state.message}</h2>
                <button
                    type="button"
                    className="btn btn-primary float-left"
                    onClick={this.onAdd}
                >
                    Add
                </button>
                <button
                    type="button"
                    className="btn btn-primary btn-extra float-left"
                    onClick={this.clearFormFields}
                >
                    Reset
                </button>
            </div>
        );
    }
}

NewSeriesForm.propTypes = {
};

NewSeriesForm.defaultProps = {
};
