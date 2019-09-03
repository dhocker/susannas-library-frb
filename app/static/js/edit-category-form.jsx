/*
    Edit category form
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
import NewCategory from "./new-category-form";
import $ from 'jquery';

export default class EditCategoryForm extends NewCategory {
    constructor(props) {
        super(props);

        this.state.id = props.match.params.categoryid;

        // Initial state
        this.loadCategory(this.state.id);

        // Bind 'this' to various methods
        this.getHeader = this.getHeader.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.commitCategory = this.commitCategory.bind(this);
        this.loadCategory = this.loadCategory.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    loadCategory(categoryid) {
        const $this = this;
        const url = "/category/" + String(categoryid);
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
        Save category
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
        const url = "/category/" + String(this.state.id);
        this.commitCategory("PUT", url, data);
    }

    getHeader() {
        return (
            <div className="card">
                <div className="row">
                    <h2 className="col-md-8">
                        Edit Category
                    </h2>
                </div>
            </div>
        );
    }

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

EditCategoryForm.propTypes = {
};

EditCategoryForm.defaultProps = {
};
