/*
    Edit series form
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
import NewSeriesForm from "./new-series-form";
import $ from 'jquery';

export default class EditSeriesForm extends NewSeriesForm {
    constructor(props) {
        super(props);

        this.state.id = props.match.params.seriesid;

        // Initial state
        this.loadSeries(this.state.id);

        // Bind 'this' to various methods
        this.getHeader = this.getHeader.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitSeries = this.commitSeries.bind(this);
        this.loadSeries = this.loadSeries.bind(this);
        this.onSave = this.onSave.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    loadSeries(seriesid) {
        const $this = this;
        const url = "/series/" + String(seriesid);
        $.get(url, function (response /* , status */) {
            const {data} = response;

            $this.setState({
                nameValue: data.name,
                message: ""
            });
            $this.setFocus();
        })
    }

    /*
        Save series
    */
    onSave() {
        // Validate fields
        if (this.state.nameValue.length <= 0) {
            this.setState({message: "Name is blank"});
            return;
        }

        const data = {
            name: this.state.nameValue,
        };

        // The data object will be request.form on the server
        this.setState({message: ""});
        const url = "/series/" + String(this.state.id);
        this.commitSeries("PUT", url, data);
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
                        Edit Series
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

    getFooter() {
        return (
            <div className="container">
                <h2 className="text-danger">{this.state.message}</h2>
            </div>
        );
    }
}

EditSeriesForm.propTypes = {
};

EditSeriesForm.defaultProps = {
};
