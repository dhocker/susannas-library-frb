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
import ModalDialog from './modal-dialog'
import * as bookstable from './books-table';

/*
    NOTE: There is a jQuery UI widget for creating dialogs: http://api.jqueryui.com/dialog/
*/

// This is the id of the element that contains the new book dialog box
const NEW_BOOK_DLG_ID = "new-book-jsx";

export default class NewBookDialog extends ModalDialog {
    constructor(props) {
        super(props);
        // Initial state
        console.log("New book for filter_by = " + props.filter_by + " " + String(props.filter_by_id));

        // Apply filtering
        var series_id = 0;
        var author_id = 0;
        switch (props.filter_by) {
            case "author":
                author_id = props.filter_by_id;
                break;
            case "series":
                series_id = props.filter_by_id;
                break;
        }
        this.state = {
            titleValue: "",
            isbnValue: "",
            volumeValue: "",
            seriesValue: series_id,
            authorValue: author_id,
            categoryValue: "Mystery",
            statusValue: "",
            coverValue: "",
            notesValue: "",
            series_rows: [],
            author_rows: [],
            error: ""
        };

        // Bind 'this' to various methods
        this.clearFormFields = this.clearFormFields.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onCancel = this.onCancel.bind(this);
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
        this.getCategorySelect = this.getCategorySelect.bind(this);
        this.getSeriesSelect = this.getSeriesSelect.bind(this);
        this.getAuthorSelect = this.getAuthorSelect.bind(this);
        this.commitBook = this.commitBook.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    /*
        Clear all form fields
    */
    clearFormFields() {
        console.log("Clear fields for filter_by = " + this.props.filter_by + " " + String(this.props.filter_by_id));

        // Apply book filtering
        var series_id = this.state.series_rows[0].id;
        var author_id = this.state.author_rows[0].id;
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
            categoryValue: "Mystery",
            statusValue: "",
            coverValue: "",
            notesValue: "",
            error: ""
        });
    }

    componentDidMount() {
        // Retrieve all of the series
        console.log("Getting all series from url /series");
        var $this = this;
        $.get("/series", function(response, status){
            console.log("Series rows received: " + String(response.data.length));
            var rows = response.data;
            $this.setState({
                series_rows: rows,
                seriesValue: rows[0].id
            });
        });

        // Retrieve all of the authors
        console.log("Getting all series from url /authors");
        var $this = this;
        $.get("/authors", function(response, status){
            console.log("Author rows received: " + String(response.data.length));
            var rows = response.data;
            $this.setState({
                author_rows: rows,
                authorValue: $this.props.author_id ? $this.props.author_id : rows[0].id
            });
        });
    }

    /*
        Cancel the dialog
    */
    onCancel() {
        console.log("Dialog canceled");
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

        /*
            There is a bit of an issue marshalling boolean values (try and avoid).
            While we are using JS booleans here, when they arrive at the server
            they will be string values :true" or "false".
        */
        var data = {
            title: this.state.titleValue,
            isbn: this.state.isbnValue,
            volume: this.state.volumeValue,
            series: this.state.seriesValue,
            author: this.state.authorValue,
            category: this.state.categoryValue,
            status: this.state.statusValue,
            cover: this.state.coverValue,
            notes: this.state.notesValue
        };
        // The data object will be request.form on the server
        this.commitBook(data);
    }

    /*
        Send book data to server
    */
    commitBook(data) {
        // The data object will be request.form on the server
        var $this = this;
        const http_verb = "POST";
        const url = "/book";
        this.serverRequest = $.ajax({
            type: http_verb,
            url: url,
            data: data,
            success: function(result){
                console.log(result);
                console.log("Book added");
                // Refresh books table to pick up the new record.
                // This is a bit of overkill but it is simple.
                bookstable.refreshBooksTable();
                // Manually close dialog
                $this.closeDialog(NEW_BOOK_DLG_ID);
            },
            error: function(xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
                // TODO It would be nice if this were another dialog box
                $this.setState({error: errorThrown});
                // Note that the dialog box is left open so the user can fix the error
            }
        })
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
        this.setState({
            volumeValue: event.target.value,
            error: ""
        });
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
        this.setState({categoryValue: event.target.value});
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

    /*
        Override to customize the dialog header (title)
        In this case, there is a simple error message embedded in the header
    */
    getHeader() {
        return (
            <div className="modal-header">
                <h1 className="modal-title">New Book</h1>
                <h2 style={{color:"red"}}>{this.state.error}</h2>
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
                                <label for="title">Title</label>
                                <input id="title" type="text" className="form-control"
                                    value={this.state.titleValue} onChange={this.titleChanged}
                                />
                            </div>
                            <div className="col-md-6">
                                <label for={this.props.id + "-category"}>Category or Genre</label>
                                {this.getCategorySelect(this.props.id + "-category")}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label for="author">Author</label>
                                {this.getAuthorSelect(this.props.id + "-author")}
                            </div>
                            <div className="col-md-6">
                                <label for="status">Status</label>
                                <input id="status" type="text"  className="form-control"
                                    value={this.state.statusValue} onChange={this.statusChanged}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label for="series">Series</label>
                                {this.getSeriesSelect(this.props.id + "-series")}
                            </div>
                            <div className="col-md-6">
                                <label for="cover">Cover</label>
                                <input id="cover" type="text"  className="form-control"
                                    value={this.state.coverValue} onChange={this.coverChanged}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label for="volume">Volume</label>
                                <input id="volume" type="text" className="form-control"
                                    value={this.state.volumeValue} onChange={this.volumeChanged}
                                />
                            </div>
                            <div className="col-md-6">
                                <label for="notes">Notes</label>
                                <input id="notes" type="text"  className="form-control"
                                    value={this.state.notesValue} onChange={this.notesChanged}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                                <label for="isbn">ISBN</label>
                                <input id="isbn" type="text" className="form-control"
                                    value={this.state.isbnValue} onChange={this.isbnChanged}
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
                  <button type="button" className="btn btn-default pull-left"
                      onClick={this.onAdd}>Add</button>
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal"
                      onClick={this.onCancel}>Cancel</button>
            </div>
        );
    }

    /*
        Generate a select element for the categories
    */
    getCategorySelect(select_id) {
        var options_list = ["Mystery", "SciFi", "Fantasy", ""];
        var option_elements = options_list.map(function(optionValue) {
            return (
                <option key={optionValue} value={optionValue}>
                    {optionValue}
                </option>
            )
        });
        return (
            <select id={select_id}
                    className="form-control"
                    value={this.state.categoryValue}
                    onChange={this.categoryChanged}>
                {option_elements}
            </select>
        )
    }

    /*
        Generate a select element for the series
        TODO We need to fetch the list of series and ids
        The value of the select needs to be the series id
    */
    getSeriesSelect(select_id) {
        var options_list = this.state.series_rows;
        var option_elements = options_list.map(function(row) {
            return (
                <option key={row.id} value={row.id}>
                    {row.name}
                </option>
            )
        });
        return (
            <select id={select_id}
                    className="form-control"
                    value={this.state.seriesValue}
                    onChange={this.seriesChanged}>
                {option_elements}
            </select>
        )
    }

    /*
        Generate a select element for the author
        TODO We need to fetch the list of authors and ids
        The value of the select needs to be the author id
    */
    getAuthorSelect(select_id) {
        var options_list = this.state.author_rows;
        var option_elements = options_list.map(function(row) {
            return (
                <option key={row.id} value={row.id}>
                    {row.LastName + ", " + row.FirstName}
                </option>
            )
        });
        return (
            <select id={select_id}
                    className="form-control"
                    value={this.state.authorValue}
                    onChange={this.authorChanged}>
                {option_elements}
            </select>
        )
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

NewBookDialog.propTypes = {
    id: React.PropTypes.string.isRequired,
};

NewBookDialog.defaultProps = {
};

/*
    Initialize the new book dialog box
*/
var newBookDialogInstance;
export function initNewBookDialog(filter_by, id) {
    ReactDOM.render(<NewBookDialog
        id={NEW_BOOK_DLG_ID}
        filter_by={filter_by}
        filter_by_id={id}
        ref={function(instance) {
            newBookDialogInstance = instance;
        }}
        />,
        document.querySelector('#new-book'));
}

/*
    Access point for clearing dialog fields
*/
export function clearNewBookDialog() {
    newBookDialogInstance.clearFormFields();
}