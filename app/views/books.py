#
# Susanna's New Library - web app for managing Susan's vast library
# Copyright (C) 2016  Dave Hocker (email: AtHomeX10@gmail.com)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the LICENSE file for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
#
from app import app
from flask import Flask, request, Response, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify
from app.models.authors import get_author
from app.models.books import get_all_books, insert_book, get_books_in_series, \
    update_book, delete_book_by_id, search_for_books, books_todict
from app.models.series import get_series
from app.models.models import Author, Book
from app.models.models import db_session
import logging

logger = logging.getLogger("app")


@app.route("/books-page", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_books_page():
    # Check for author id first.
    if "author" in request.args:
        # Show books for author
        id = request.args.get('author', '')
        logger.info("Show books for author: %s", id)
        author = get_author(id)
        name = author.LastName + ", " + author.FirstName
        filter_by = "author"
    elif "series" in request.args:
        # Show books for series
        id = request.args.get('series', '')
        logger.info("Show books for series: %s", id)
        series = get_series(id)
        name = series.name
        filter_by = "series"
    elif "search" in request.args:
        # Show books by search criteria
        id = ""
        name = request.args.get('search', '')
        logger.info("Show books for search criteria: %s", name)
        filter_by = "search"
    else:
        # All books
        id = ""
        name = ""
        filter_by = ""
    return render_template("books.html", filter_by=filter_by, id=id, name=name)


@app.route("/books", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_books_with_filter():
    """
    Get books with optional search parameters.
    No search parameters returns all books.
    Parameter author=author_id returns all books for an author.
    Parameter series=series_id returns all books in a series.
    Parameter search=search_arg returns all books where search_arg is in title.
    Parameter sortcol=sort_column returns books sorted by this column
    Parameter sortdir=sort_direction asc (ascending) or desc (descending)
    :return:
    """
    author_id = request.args.get('author', '')
    series_id = request.args.get('series', '')
    search_arg = request.args.get('search', '')
    if author_id:
        logger.info("Books for author: %s", author_id)
    elif series_id:
        logger.info("Books for series: %s", series_id)
    elif search_arg:
        logger.info("Books containing: %s", search_arg)
    else:
        pass

    # TODO Implement sorting
    if author_id or series_id or search_arg:
        books = search_for_books(author_id, series_id, search_arg)
    else:
        logger.info("All books")
        books = get_all_books()

    json = jsonify({'data': books})
    return json


@app.route("/book", methods=['POST'])
def add_book():
    """
    Add a new book.
    request.form is a dict containing the data sent by the client ajax call.
    :return:
    """
    title = request.form["title"]
    isbn = request.form["isbn"]
    volume = request.form["volume"]
    series_id = request.form["series"]
    author_id = request.form["author"]
    category = request.form["category"]
    status = request.form["status"]
    cover = request.form["cover"]
    notes = request.form["notes"]

    logger.info("Add book with: [%s] [%s] [%s] [%s] [%s] [%s] [%s] [%s] [%s]",
                title, isbn, volume, series_id, author_id, category, status, cover, notes)
    insert_book(title, isbn, volume, series_id, author_id, category, status, cover, notes)
    return "SUCCESS: Book created", 201


@app.route("/book/<id>", methods=['PUT'])
def edit_book(id):
    """
    Edit an existing book.
    request.form is a dict containing the data sent by the client ajax call.
    :return:
    """
    title = request.form["title"]
    isbn = request.form["isbn"]
    volume = request.form["volume"]
    series_id = int(request.form["series"].encode('utf-8'))
    author_id = int(request.form["author"].encode('utf-8'))
    category = request.form["category"]
    status = request.form["status"]
    cover = request.form["cover"]
    notes = request.form["notes"]

    logger.info("Edit book with: [%s] [%s] [%s] [%s] [%s] [%s] [%s] [%s] [%s]",
                title, isbn, volume, series_id, author_id, category, status, cover, notes)

    try:
        update_book(id, title, isbn, volume, series_id, author_id, category, status, cover, notes)
    except Exception as ex:
        logger.info("Book update failed: %s", ex.message)
        return "ERROR: Book update failed", 409

    return "SUCCESS: Book updated", 200


@app.route("/book/<id>", methods=['DELETE'])
def delete_book(id):
    logger.info("Delete book id: [%s]", id)
    delete_book_by_id(id)
    return "Book deleted", 200
