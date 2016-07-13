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
from app.models.authors import get_all_authors, insert_author, authors_todict
from app.models.models import Author, Book
from app.models.models import db_session
from app.models.authors import insert_author, delete_author_by_id, author_exists, get_author, \
    update_author, search_for_authors
import logging
from Version import GetVersion

logger = logging.getLogger("app")

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route("/", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_root():
    return redirect(url_for("get_home"))


@app.route("/authors-page", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_home():
    """
    The home page is the authors page
    :return:
    """
    return render_template("authors.html")


@app.route("/authors", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_authors():
    """
    Get authors with optional search parameters.
    No search parameters returns all authors.
    Parameter search=search_arg returns all books where search_arg is in title.
    :return:
    """
    page_number = int(request.args.get('page', ''))
    page_size = int(request.args.get('pagesize', ''))
    search_arg = request.args.get('search', '')
    sort_col = request.args.get('sortcol', '')
    sort_dir = request.args.get('sortdir', '')

    # Check for search first. Default to all.
    if search_arg:
        logger.info("Search authors: %s", search_arg)
        authors = search_for_authors(page_number, page_size, search_arg, sort_col, sort_dir)
    else:
        authors = get_all_authors(page_number, page_size, sort_col, sort_dir)

    json = jsonify({"data": authors})
    return json


@app.route("/author", methods=['POST'])
def add_author():
    """
    Add a new author.
    request.form is a dict containing the data sent by the client ajax call.
    :return:
    """
    firstname = request.form["firstname"]
    lastname = request.form["lastname"]
    category = request.form["category"]

    # Marshal boolean values
    try_author = normalize_boolean(request.form["try"])
    avoid = normalize_boolean(request.form["avoid"])

    # Duplicate check
    c = author_exists(lastname, firstname)
    if c > 0:
        logger.info("Author exists: %s, %s", lastname, firstname)
        return "ERROR: Author exists", 409

    logger.info("Add author with: [%s] [%s] [%s] [%s] [%s]", firstname, lastname, category, try_author, avoid)
    insert_author(lastname, firstname, category, try_author, avoid)
    return "SUCCESS: Author created", 201


@app.route("/author/<id>", methods=['PUT'])
def edit_author(id):
    """
    Edit an existing author.
    request.form is a dict containing the data sent by the client ajax call.
    :return:
    """
    firstname = request.form["firstname"]
    lastname = request.form["lastname"]
    category = request.form["category"]

    # Marshal boolean values
    try_author = normalize_boolean(request.form["try"])
    avoid = normalize_boolean(request.form["avoid"])

    # TODO Duplicate author check needed here. Make sure updated
    # author does not exist (we are not trying to morph one author
    # into another existing author).
    author = get_author(id)
    if author.FirstName != firstname or author.LastName != lastname:
        c = author_exists(lastname, firstname)
        if c > 0:
            logger.info("Author exists: %s, %s", lastname, firstname)
            return "ERROR: Author exists", 409

    logger.info("Edit author with: [%s] [%s] [%s] [%s] [%s] [%s]", id, firstname, lastname, category, try_author, avoid)
    try:
        author.LastName = lastname
        author.FirstName = firstname
        author.category = category
        author.try_author = try_author
        author.Avoid = avoid
        update_author(author)
    except Exception as ex:
        logger.info("Author update failed: %s", ex.message)
        return "ERROR: Author update failed", 409

    return "SUCCESS: Author updated", 200


@app.route("/author/<id>", methods=['DELETE'])
def delete_author(id):
    logger.info("Delete author id: [%s]", id)
    delete_author_by_id(id)
    return "Author deleted", 200


@app.route("/about", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_about():
    about = {
        "data": {
            "version": GetVersion()
        }
    }
    return jsonify(about)


def normalize_boolean(str_value):
    """
    Normalize a string representation of a boolean value.
    :param str_value: 'true' or 'false'
    :return: True or False
    """
    v = False
    if str_value.encode('utf-8').lower() == "true":
        v = True
    return v

# Books
