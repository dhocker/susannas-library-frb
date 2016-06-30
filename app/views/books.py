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
from app.models.books import get_all_books, insert_book, get_books_in_series, update_book, delete_book_by_id
from app.models.models import Author, Book
from app.models.models import db_session
import logging

logger = logging.getLogger("app")


@app.route("/books-page", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_books_page():
    # Check for author id first.
    if "a" in request.args:
        # Show books for author
        author_id = request.args.get('a', '')
        logger.info("Show books for author: %s", author_id)
        author = get_author(author_id)
        author_name = author.LastName + ", " + author.FirstName
    else:
        # All books
        author_id = ""
        author_name = ""
    return render_template("books.html", author_id=author_id, author_name=author_name)


@app.route("/books", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_books_for_author():
    """
    Get all books with optional search parameters.
    No search parameters returns all books.
    Search parameter a=author_id returns all books for an author.
    Search parameter s=series_id returns all books in a series.
    :return:
    """
    sort_required = False
    author_id = request.args.get('a', '')
    series_id = request.args.get('s', '')
    if author_id:
        logger.info("Books for author: %s", author_id)
        author = get_author(author_id)
        books = author.books
        sort_required = True
    elif series_id:
        logger.info("Books for series: %s", series_id)
        books = get_books_in_series(series_id)
        sort_required = True
    else:
        logger.info("All books")
        books = get_all_books()

    # This is model code and needs to be moved to the authors.py file
    ca = []
    for b in books:
        aa = Book.row2dict(b)
        # TODO This is model code and needs to be moved there
        if b.series:
            aa["Series"] = b.series.name
            aa["series_id"] = b.series.id
        else:
            aa["Series"] = ""
        author_str = ""
        # In the existing DB all books DO NOT have an author(s)
        # TODO This is extremely slow when ALL books are being fetched.
        # The authors appear to be a lazy secondary query using the
        # association table. Paging for all books is about the only
        # way to deal with this.
        if len(b.authors):
            author_str = b.authors[0].LastName
            if len(b.authors[0].FirstName):
                author_str += ", " + b.authors[0].FirstName
            aa["author_id"] = b.authors[0].id
            # Report books with multiple authors
            if (len(b.authors) > 1):
                logger.warn("Book id %s has %d authors", b.id, len(b.authors))
        else:
            logger.warn("Book id %s has no authors", b.id)
        # To condense the author field, we only show one author.
        # If there is more than one author, we mark the name with a "+".
        if len(b.authors) > 1:
            author_str += " +"
        aa["Author"] = author_str

        ca.append(aa)

    # Title sort when required
    if sort_required:
        ca = sorted(ca, key=lambda k: k["Title"])

    json = jsonify({'data': ca})
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
    series_id = request.form["series"]
    author_id = request.form["author"]
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
