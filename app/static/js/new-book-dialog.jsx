/*
    React + Bootstrap mew book dialog box
    Copyright © 2016  Dave Hocker (email: AtHomeX10@gmail.com)

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
import ModalDialog from './modal-dialog';
import * as callstack from './dialog-call-stack';
import * as errordlg from './error-dialog';
import SelectCategory from './select-category';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new book dialog box
const NEW_BOOK_DLG_ID = "new-book-jsx";

export default class NewBookDialog extends ModalDialog {
    constructor(props) {
        super(props);
        // Initial state
        if (props.filter_by && props.filter_by_id) {
            console.log("NewBookDialog filter_by = " + props.filter_by +
                " " + String(props.filter_by_id));
        }

        // Apply filtering
        let series_id = 0;
        let author_id = 0;
        switch (props.filter_by) {
            case "author":
                author_id = props.filter_by_id;
                break;
            case "series":
                series_id = props.filter_by_id;
                break;
            default:
                break;
        }

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
        this.clearFormFields = this.clearFormFields.bind(this);
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
        this.newAuthorClicked = this.newAuthorClicked.bind(this);
        this.newSeriesClicked = this.newSeriesClicked.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getBody = this.getBody.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.getSeriesSelect = this.getSeriesSelect.bind(this);
        this.getAuthorSelect = this.getAuthorSelect.bind(this);
        this.commitBook = this.commitBook.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.loadAuthors = this.loadAuthors.bind(this);
        this.loadSeries = this.loadSeries.bind(this);
        this.setFocus = this.setFocus.bind(this);
    }

    loadAuthors() {
        // Retrieve all of the authors
        console.log("Getting all series from url /authors");
        const $this = this;
        $.get("/authors", function (response /* , status */) {
            console.log("Author rows received: " + String(response.data.rows.length));
            const rows = response.data.rows;
            $this.setState({
                author_rows: rows,
                authorValue: $this.state.authorValue
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
            const rows = response.data.rows;
            $this.setState({
                series_rows: rows,
                seriesValue: $this.state.seriesValue
            });
            $this.setFocus();
        });
    }

    /*
        Clear all form fields
    */
    clearFormFields() {
        console.log("Clear fields for filter_by = " + this.props.filter_by + " " +
            String(this.props.filter_by_id));

        // Apply book filtering
        let series_id = 0;
        let author_id = 0;
        if (this.state.series_rows.length) {
            series_id = this.state.series_rows[0].id;
        }
        if (this.state.author_rows.length) {
            author_id = this.state.author_rows[0].id;
        }
        switch (this.props.filter_by) {
            case "author":
                author_id = this.props.filter_by_id;
                break;
            case "series":
                series_id = this.props.filter_by_id;
                break;
            default:
                break;
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
            error: ""
        });

        // Reset the categories combo box to its default value
        this.selectCategoryInstance.resetSelectedCategory();
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
        // Set up event handlers so we can reload the combo boxes
        // We can't set up this event until the component is mounted
        const $this = this;
        $("#" + NEW_BOOK_DLG_ID).on('show.bs.modal', function () {
            // Only load the tables once
            if ($this.state.author_rows.length === 0) {
                $this.loadAuthors();
            }
            if ($this.state.series_rows.length === 0) {
                $this.loadSeries();
            }
        });

        // Handle new series added event
        $("#new-series").on("frb.series.add", function (/* event */) {
            $this.loadSeries();
        });

        // Handle new author added event
        $("#new-author").on("frb.author.add", function (/* event */) {
            $this.loadAuthors();
        });
    }

    /*
        Add book
    */
    onAdd() {
        // Validate fields
        this.setState({error: ""});
        if (this.state.titleValue.length <= 0) {
            this.setState({error: "Title is blank"});
            return;
        }
        if (this.state.volumeValue.length > 0) {
            const v = Number(this.state.volumeValue);
            if (isNaN(v)) {
                this.setState({error: "Volume must be a number or empty"});
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

    /*
        Send book data to server
    */
    commitBook(data) {
        // The data object will be request.form on the server
        const $this = this;
        const http_verb = "POST";
        const url = "/book";
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function (result) {
                console.log(result);
                console.log("Book added");
                // Refresh books table to pick up the new record.
                // Fire event for book add
                $("#new-book").trigger("frb.book.add");
                // Manually close dialog
                $this.closeDialog(NEW_BOOK_DLG_ID);
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                // TODO It would be nice if this were another dialog box
                // $this.setState({error: errorThrown});
                errordlg.showErrorDialog("New Book Error", errorThrown);
                // Note that the dialog box is left open so the user can fix the error
            }
        });
    }

    /*
        Control event handlers
    */
    titleChanged(event) {
        this.setState({
            titleValue: event.target.value,
            error: ""
        });
    }

    isbnChanged(event) {
        this.setState({
            isbnValue: event.target.value,
            error: ""
        });
    }

    volumeChanged(event) {
        // Validate volume as a number
        if (event.target.value.length > 0) {
            const v = Number(event.target.value);
            if (!isNaN(v)) {
                this.setState({
                    volumeValue: event.target.value,
                    error: ""
                });
            }
            else {
                this.setState({
                    volumeValue: event.target.value,
                    error: "Volume must be a numbers or empty"
                });
            }
        }
        else {
            this.setState({
                volumeValue: event.target.value,
                error: ""
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

    newAuthorClicked(/* event */) {
        callstack.callDialog("new-author-jsx");
    }

    newSeriesClicked(/* event */) {
        callstack.callDialog("new-series-jsx");
    }

    /*
        Override to customize the dialog header (title)
        In this case, there is a simple error message embedded in the header
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h1 className="modal-title">
                    <img className="dialog-logo" alt="logo" src="/static/book_pile2.jpg" />
                    New Book
                </h1>
                <h2 style={{color: "red"}}>{this.state.error}</h2>
            </div>
        );
    }

    /*
        Override to customize the dialog body. For example, return
        a form element to build a form-in-a-dialog.
    */
    getBody() {
        return (
            <form id={this.props.id} role="form">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor={"title-input"}>Title</label>
                                <input
                                    id={"title-input"}
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
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor={this.props.id + "-author"}>Author</label>
                                {this.getAuthorSelect(this.props.id + "-author")}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor={"status"}>Status</label>
                                <input
                                    id={"status"}
                                    type="text"
                                    className="form-control"
                                    value={this.state.statusValue}
                                    onChange={this.statusChanged}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor={this.props.id + "-series"}>Series</label>
                                {this.getSeriesSelect(this.props.id + "-series")}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor={"cover"}>Cover</label>
                                <input
                                    id={"cover"}
                                    type="text"
                                    className="form-control"
                                    value={this.state.coverValue}
                                    onChange={this.coverChanged}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor={"volume"}>Volume</label>
                                <input
                                    id={"volume"}
                                    type="text"
                                    className="form-control"
                                    value={this.state.volumeValue}
                                    onChange={this.volumeChanged}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor={"notes"}>Notes</label>
                                <input
                                    id={"notes"}
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
                                <label htmlFor={"isbn"}>ISBN</label>
                                <input
                                    id={"isbn"}
                                    type="text"
                                    className="form-control"
                                    value={this.state.isbnValue}
                                    onChange={this.isbnChanged}
                                />
                            </div>
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
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-default pull-left"
                    onClick={this.onAdd}
                >
                    Add
                </button>
                <button
                    type="button"
                    className="btn btn-default pull-left"
                    onClick={this.onCancel}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.newAuthorClicked}
                >
                    New Author
                </button>
                <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.newSeriesClicked}
                >
                    New Series
                </button>
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
                    {row.name}
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
                    {row.LastName + ", " + row.FirstName}
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

NewBookDialog.propTypes = {
    id: React.PropTypes.string.isRequired,
};

NewBookDialog.defaultProps = {
};

/*
    Initialize the new book dialog box
*/
let newBookDialogInstance;
export function initNewBookDialog(filter_by, id) {
    ReactDOM.render(
        <NewBookDialog
            id={NEW_BOOK_DLG_ID}
            size={"md"}
            filter_by={filter_by}
            filter_by_id={id}
            ref={(instance) => {
                newBookDialogInstance = instance;
            }}
        />,
        document.querySelector('#new-book')
    );
}

/*
    Access point for clearing dialog fields
*/
export function clearNewBookDialog() {
    newBookDialogInstance.clearFormFields();
}
