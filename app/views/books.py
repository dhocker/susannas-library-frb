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
from app.models.books import get_all_books
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
    Get all books for a given author id
    The author id is the search parameter a=id
    :return:
    """
    sort_required = False
    author_id = request.args.get('a', '')
    if author_id:
        logger.info("Books for author: %s", author_id)
        author = get_author(author_id)
        books = author.books
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
        else:
            aa["Series"] = ""
        author_str = b.authors[0].LastName + ", " + b.authors[0].FirstName
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
