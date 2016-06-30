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
from app.models.authors import get_author
from app.models.series import get_all_series, get_series, insert_series, series_exists, \
    update_series, delete_series_by_id
from app.models.models import Author, Book, Series
from app.models.models import db_session
import logging

logger = logging.getLogger("app")

@app.route("/series-page", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_series_page():
    """
    The home page is the series page
    :return:
    """
    return render_template("series.html")

@app.route("/series", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_all_series_records():
    series = get_all_series()

    # TODO This is model code and needs to be moved to the series.py file
    ca = []
    for s in series:
        aa = Series.row2dict(s)
        ca.append(aa)

    json = jsonify({'data': ca})
    return json

@app.route("/series", methods=['POST'])
def add_series():
    """
    Add a new series.
    request.form is a dict containing the data sent by the client ajax call.
    :return:
    """
    name = request.form["name"]

    # Duplicate check
    c = series_exists(name)
    if c > 0:
        logger.info("Series exists: %s", name)
        return "ERROR: Series exists", 409

    logger.info("Add series with: [%s]", name)
    insert_series(name)
    return "SUCCESS: Series created", 201

@app.route("/series/<id>", methods=['PUT'])
def edit_series(id):
    """
    Edit an existing series.
    request.form is a dict containing the data sent by the client ajax call.
    :return:
    """
    name = request.form["name"]

    # Make sure we aren't trying to morph one series
    # into another already existing one.
    series = get_series(id)
    if series.name != name:
        # Dup check needed
        c = series_exists(name)
        if c > 0:
            logger.info("Series exists: %s", name)
            return "ERROR: Series exists", 409

    logger.info("Edit series with: [%s] [%s]", id, name)
    try:
        series.name = name
        update_series(series)
    except Exception as ex:
        logger.info("Series update failed: %s", ex.message)
        return "ERROR: Series update failed", 409

    return "SUCCESS: Series updated", 200

@app.route("/series/<id>", methods=['DELETE'])
def delete_series(id):
    logger.info("Delete series id: [%s]", id)
    delete_series_by_id(id)
    return "Author deleted", 200
