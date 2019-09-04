/*
    React + Bootstrap new book
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
import SelectCategory from './select-category';
import $ from 'jquery';

export default class NewBookForm extends React.Component {
    constructor(props) {
        super(props);

        // Default choices
        let series_id = -1;
        let author_id = -1;

        this.state = {};
        this.state.titleValue = "";
        this.state.isbnValue = "";
        this.state.volumeValue = "";
        this.state.seriesValue = series_id;
        this.state.authorValue = author_id;
        this.state.categoryValue = 1;
        this.state.statusValue = "";
        this.state.coverValue = "";
        this.state.notesValue = "";
        this.state.series_rows = [];
        this.state.author_rows = [];
        this.state.category_rows = [];
        this.state.error = "";

        // Bind 'this' to various methods
        this.onAdd = this.onAdd.bind(this);
        this.titleChanged = this.titleChanged.bind(this);
        this.isbnChanged = this.isbnChanged.bind(this);
        this.volumeChanged = this.volumeChanged.bind(this);
        this.seriesChanged = this.seriesChanged.bind(this);
        this.authorChanged = this.authorChanged.bind(this);
        this.categoryChanged = this.categoryChanged.bind(this);
        this.statusChanged = this.statusChanged.bind(this);
        this.coverChanged = this.coverChanged.bind(this);
        this.notesChanged = this.notesChanged.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.getSeriesSelect = this.getSeriesSelect.bind(this);
        this.getAuthorSelect = this.getAuthorSelect.bind(this);
        this.commitBook = this.commitBook.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.loadAuthors = this.loadAuthors.bind(this);
        this.loadSeries = this.loadSeries.bind(this);
        this.clearFormFields = this.clearFormFields.bind(this);
        this.setFocus = this.setFocus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
   }

    loadAuthors() {
        // Retrieve all of the authors
        console.log("Getting all series from url /authors");
        const $this = this;
        $.get("/authors", function (response /* , status */) {
            console.log("Author rows received: " + String(response.data.rows.length));
            const {rows} = response.data;

            // Pick default if necessary
            let author_id = $this.state.authorValue;
            if ((rows.length > 0) && (author_id < 0)) {
                author_id = rows[0].id;
            }

            $this.setState({
                author_rows: rows,
                authorValue: author_id,
            });
            $this.setFocus();
        });
    }

    loadSeries() {
        // Retrieve all of the series
        console.log("Getting all series from url /series");
        const $this = this;
        $.get("/series", function (response /* , status */) {
            console.log("Series rows received: " + String(response.data.rows.length));
            const {rows} = response.data;

            // Pick default if necessary
            let series_id = $this.state.seriesValue;
            if ((rows.length > 0) && (series_id < 0)) {
                series_id = rows[0].id;
            }

            $this.setState({
                series_rows: rows,
                seriesValue: series_id
            });
            $this.setFocus();
        });
    }

    /*
        Reset all form fields
    */
    clearFormFields() {
        const {series_rows} = this.state;
        const {author_rows} = this.state;

        // Apply book filtering
        let series_id = -1;
        let author_id = -1;
        if (series_rows.length) {
            series_id = series_rows[0].id;
        }
        if (author_rows.length) {
            author_id = author_rows[0].id;
        }

        this.setState({
            titleValue: "",
            isbnValue: "",
            volumeValue: "",
            seriesValue: series_id,
            authorValue: author_id,
            categoryValue: 1,
            statusValue: "",
            coverValue: "",
            notesValue: "",
            message: ""
        });

        // Reset the categories combo box to its default value
        this.selectCategoryInstance.resetSelectedCategory();

        this.setFocus();
    }

    setFocus() {
        const $this = this;
        // Trick to get focus into input text box
        setTimeout(function () {
            $this.titleInput.focus();
            $this.titleInput.select();
        }, 0);
    }

    componentDidMount() {
        this.loadAuthors();
        this.loadSeries();
    }

    /*
        Add book
    */
    onAdd() {
        // Validate fields
        this.setState({message: ""});
        if (this.state.titleValue.length <= 0) {
            this.setState({message: "Title is blank"});
            return;
        }
        if (this.state.volumeValue.length > 0) {
            const v = Number(this.state.volumeValue);
            if (Number.isNaN(v)) {
                this.setState({message: "Volume must be a number or empty"});
                return;
            }
        }

        /*
            There is a bit of an issue marshalling boolean values (try and avoid).
            While we are using JS booleans here, when they arrive at the server
            they will be string values :true" or "false".
        */
        const data = {
            title: this.state.titleValue,
            isbn: this.state.isbnValue,
            volume: this.state.volumeValue,
            series: this.state.seriesValue,
            author: this.state.authorValue,
            category: this.state.categoryValue,
            status: this.state.statusValue,
            cover: this.state.coverValue,
            notes: this.state.notesValue,
        };
        // The data object will be request.form on the server
        this.commitBook(data);
    }

    // Catches the Enter key (which gets interpreted as a submit action)
    handleSubmit(event) {
        this.onAdd();
        event.preventDefault();
    }

    /*
        Send book data to server
    */
    commitBook(data) {
        const $this = this;
        // The data object will be request.form on the server
        const http_verb = "POST";
        const url = "/book";
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function (result) {
                console.log(result);
                console.log("Book added");
                $this.setState({message: "Book added"})
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                $this.setState({message: errorThrown})
            }
        });
    }

    /*
        Control event handlers
    */
    titleChanged(event) {
        this.setState({
            titleValue: event.target.value,
            message: ""
        });
    }

    isbnChanged(event) {
        this.setState({
            isbnValue: event.target.value,
            message: ""
        });
    }

    volumeChanged(event) {
        // Validate volume as a number
        if (event.target.value.length > 0) {
            const v = Number(event.target.value);
            if (!Number.isNaN(v)) {
                this.setState({
                    volumeValue: event.target.value,
                    message: ""
                });
            }
            else {
                this.setState({
                    volumeValue: event.target.value,
                    message: "Volume must be a numbers or empty"
                });
            }
        }
        else {
            this.setState({
                volumeValue: event.target.value,
                message: ""
            });
        }
    }

    seriesChanged(event) {
        // The value is the series id, NOT the series name
        this.setState({seriesValue: event.target.value});
    }

    authorChanged(event) {
        // The value is the author id NOT the author last/first name
        this.setState({authorValue: event.target.value});
    }

    categoryChanged(event) {
        this.setState({categoryValue: event.newValue});
    }

    statusChanged(event) {
        this.setState({statusValue: event.target.value});
    }

    coverChanged(event) {
        this.setState({coverValue: event.target.value});
    }

    notesChanged(event) {
        this.setState({notesValue: event.target.value});
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

    /*
        Override to customize the form header (title)
        In this case, there is a simple error message embedded in the header
    */
    getHeader() {
        return (
            <div className="card">
                <div className="row">
                    <h2 className="col-md-8">
                        New Book
                    </h2>
                </div>
            </div>
        );
    }

    /*
        Override to customize the form body. For example, return
        a form element to build a form-in-a-dialog.
    */
    getBody() {
        const id = "new-book-form";
        return (
            <form id={id} onSubmit={this.handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="title-input">
                                    Title
                                </label>
                                <input
                                    id="title-input"
                                    type="text"
                                    className="form-control"
                                    ref={(instance) => {
                                        this.titleInput = instance;
                                    }}
                                    value={this.state.titleValue}
                                    onChange={this.titleChanged}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor={id + "-category"}>
                                    Category or Genre
                                </label>
                                <SelectCategory
                                    id={id + "-category"}
                                    onChange={this.categoryChanged}
                                    ref={(instance) => {
                                        this.selectCategoryInstance = instance;
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor={id + "-author"}>
                                    Author
                                </label>
                                {this.getAuthorSelect(id + "-author")}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="status">
                                    Status
                                </label>
                                <input
                                    id="status"
                                    type="text"
                                    className="form-control"
                                    value={this.state.statusValue}
                                    onChange={this.statusChanged}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor={id + "-series"}>
                                    Series
                                </label>
                                {this.getSeriesSelect(id + "-series")}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="cover">
                                    Cover
                                </label>
                                <input
                                    id="cover"
                                    type="text"
                                    className="form-control"
                                    value={this.state.coverValue}
                                    onChange={this.coverChanged}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="volume">
                                    Volume
                                </label>
                                <input
                                    id="volume"
                                    type="text"
                                    className="form-control"
                                    value={this.state.volumeValue}
                                    onChange={this.volumeChanged}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="notes">
                                    Notes
                                </label>
                                <input
                                    id="notes"
                                    type="text"
                                    className="form-control"
                                    value={this.state.notesValue}
                                    onChange={this.notesChanged}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="isbn">
                                    ISBN
                                </label>
                                <input
                                    id="isbn"
                                    type="text"
                                    className="form-control"
                                    value={this.state.isbnValue}
                                    onChange={this.isbnChanged}
                                />
                            </div>
                        </div>
                    </div>
                    {this.getActionButtons()}
                </div>
            </form>
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

    /*
        Generate a select element for the series
        The value of the select needs to be the series id
    */
    getSeriesSelect(select_id) {
        const options_list = this.state.series_rows;
        const option_elements = options_list.map(function (row) {
            return (
                <option key={row.id} value={row.id}>
                    {row.name + " (" + String(row.id) + ")"}
                </option>
            );
        });
        return (
            <select
                id={select_id}
                className="form-control"
                value={this.state.seriesValue}
                onChange={this.seriesChanged}
            >
                {option_elements}
            </select>
        );
    }

    /*
        Generate a select element for the author
        TODO We need to fetch the list of authors and ids
        The value of the select needs to be the author id
    */
    getAuthorSelect(select_id) {
        const options_list = this.state.author_rows;
        const option_elements = options_list.map(function (row) {
            return (
                <option key={row.id} value={row.id}>
                    {row.LastName + ", " + row.FirstName + " (" + String(row.id) + ")"}
                </option>
            );
        });
        return (
            <select
                id={select_id}
                className="form-control"
                value={this.state.authorValue}
                onChange={this.authorChanged}
            >
                {option_elements}
            </select>
        );
    }
}

NewBookForm.propTypes = {
};

NewBookForm.defaultProps = {
};
