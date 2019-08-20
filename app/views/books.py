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
from flask import request, jsonify
from app.models.books import insert_book, update_book, delete_book_by_id
from app.models.sql_books import get_book_by_id
import logging

logger = logging.getLogger("app")


@app.route("/book/<id>", methods=['GET'])
def get_book_from_id(id):
    book = get_book_by_id(id)
    if book:
        return jsonify({"data": book })
    return "ERROR: Book not found", 404


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
    category_id = request.form["category"]
    status = request.form["status"]
    cover = request.form["cover"]
    notes = request.form["notes"]

    logger.info("Add book with: [%s] [%s] [%s] [%s] [%s] [%s] [%s] [%s] [%s]",
                title, isbn, volume, series_id, author_id, category_id, status, cover, notes)
    insert_book(title, isbn, volume, series_id, author_id, category_id, status, cover, notes)
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
    category_id = request.form["category"]
    status = request.form["status"]
    cover = request.form["cover"]
    notes = request.form["notes"]

    logger.info("Edit book with: [%s] [%s] [%s] [%s] [%s] [%s] [%s] [%s] [%s]",
                title, isbn, volume, series_id, author_id, category_id, status, cover, notes)

    try:
        update_book(id, title, isbn, volume, series_id, author_id, category_id, status, cover, notes)
    except Exception as ex:
        logger.info("Book update failed: %s", ex.message)
        return "ERROR: Book update failed", 409

    return "SUCCESS: Book updated", 200


@app.route("/book/<id>", methods=['DELETE'])
def delete_book(id):
    logger.info("Delete book id: [%s]", id)
    delete_book_by_id(id)
    return "Book deleted", 200
