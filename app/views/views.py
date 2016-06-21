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
from flask import Flask, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify
from app.models.authors import get_all_authors, insert_author, get_page_of_authors
from app.models.models import Author, Book
from app.models.datatables_factory import DataTablesFactory
from app.models.models import db_session
from app.models.authors import insert_author, delete_author_by_id, get_author, update_author
import json
import logging

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
    authors = get_all_authors()
    # This is model code and needs to be moved to the authors.py file
    ca = []
    for a in authors:
        aa = Author.row2dict(a)
        if aa["try_author"] == "True":
            aa["try_author"] = "Try"
        else:
            aa["try_author"] = ""
        if aa["Avoid"] == "True":
            aa["Avoid"] = "Avoid"
        else:
            aa["Avoid"] = ""
        ca.append(aa)

    json = jsonify({'data': ca})
    return json


@app.route("/author", methods=['PUT'])
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
    try_author_str = request.form["try"]
    try_author = False
    if try_author_str.encode('utf-8').lower() == "true":
        try_author = True

    avoid_str = request.form["avoid"]
    avoid = False
    if avoid_str.encode('utf-8').lower() == "true":
        avoid = True

    logger.info("Add author with: [%s] [%s] [%s] [%s] [%s]", firstname, lastname, category, try_author, avoid)
    insert_author(lastname, firstname, category, try_author, avoid)
    return "author created"


@app.route("/author/<id>", methods=['DELETE'])
def delete_author(id):
    logger.info("Delete author id: [%s]", id)
    delete_author_by_id(id)
    return "Author deleted"


@app.route("/form-page", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_form():
    return render_template("form.html")


@app.route("/formdata", methods=['PUT'])
def save_form():
    # Save form data
    # args = json.loads(request.data.decode())
    # request.form is a dict containing the data sent by the client ajax call
    firstname = request.form["firstname"]
    lastname = request.form["lastname"]
    category = request.form["category"]
    try_author = request.form["try"]
    avoid = request.form["avoid"]
    logger.info("Add author with: [%s] [%s] [%s] [%s] [%s]", firstname, lastname, category, try_author, avoid)
    insert_author(lastname, firstname, category, try_author, avoid)
    return "author created"


@app.route("/about", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_about():
    #return render_template("home.html", authors=authors)
    return "About"
