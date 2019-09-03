#
# Susanna's New Library - web app for managing Susan's vast library
# Copyright (c) 2016  Dave Hocker (email: AtHomeX10@gmail.com)
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
from app.models.categories import get_all_categories, insert_category, \
    delete_category_by_id, update_category, category_exists, get_category, get_category_as_dict, \
    search_for_categories
import logging

logger = logging.getLogger("app")

@app.route("/categories-page", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_categories_page():
    """
    The home page is the series page
    :return:
    """
    return render_template("categories.html")

@app.route("/categories", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_category_records():
    page_number = int(request.args.get('page', 0))
    page_size = int(request.args.get('pagesize', 0))
    search_arg = request.args.get('search', '')
    sort_col = request.args.get('sortcol', '')
    sort_dir = request.args.get('sortdir', '')

    if search_arg:
        categories = search_for_categories(page_number, page_size, search_arg, sort_col, sort_dir)
    else:
        categories = get_all_categories(page_number, page_size, sort_col, sort_dir)

    json = jsonify({'data': categories})
    return json

@app.route("/category/<id>", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_category_record(id):
    category = get_category_as_dict(id)

    json = jsonify({'data': category})
    return json

@app.route("/category", methods=['POST'])
def add_category():
    """
    Add a new series.
    request.form is a dict containing the data sent by the client ajax call.
    :return:
    """
    name = request.form["name"]

    # Duplicate check
    c = category_exists(name)
    if c > 0:
        logger.info("Category exists: %s", name)
        return "ERROR: Category exists", 409

    logger.info("Add category with: [%s]", name)
    insert_category(name)
    return "SUCCESS: Category created", 201

@app.route("/category/<id>", methods=['PUT'])
def edit_category(id):
    """
    Edit an existing category.
    request.form is a dict containing the data sent by the client ajax call.
    :return:
    """
    name = request.form["name"]

    # Make sure we aren't trying to morph one series
    # into another already existing one.
    category = get_category(id)
    if category.name != name:
        # Dup check needed
        c = category_exists(name)
        if c > 0:
            logger.info("Category exists: %s", name)
            return "ERROR: Category exists", 409

        logger.info("Edit category with: [%s] [%s]", id, name)
        try:
            category.name = name
            update_category(category)
        except Exception as ex:
            logger.info("Category update failed: %s", ex.message)
            return "ERROR: Category update failed", 409

    return "SUCCESS: Category updated", 200

@app.route("/category/<id>", methods=['DELETE'])
def delete_category(id):
    logger.info("Delete category id: [%s]", id)
    delete_category_by_id(id)
    return "Category deleted", 200
