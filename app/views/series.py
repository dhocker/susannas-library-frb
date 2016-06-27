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
from app.models.series import get_all_series
from app.models.models import Author, Book, Series
from app.models.models import db_session
import logging

logger = logging.getLogger("app")


@app.route("/series", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_series():
    series = get_all_series()

    # TODO This is model code and needs to be moved to the series.py file
    ca = []
    for s in series:
        aa = Series.row2dict(s)
        ca.append(aa)

    json = jsonify({'data': ca})
    return json
