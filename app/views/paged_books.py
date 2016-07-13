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
#from app.models.books import get_books_by_page, search_for_books_by_page
from app.models.sql_books import get_books_by_page, search_for_books_by_page
from app.models.series import get_series
import logging

logger = logging.getLogger("app")


@app.route("/paged-books-page", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_paged_books_page():
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
    return render_template("paged-books.html", filter_by=filter_by, id=id, name=name)


@app.route("/paged-books", methods=['GET'])
#@login_required                                 # Use of @login_required decorator
def get_paged_books_with_filter():
    """
    Get books with optional search parameters.
    No search parameters returns all books.
    Parameter author=author_id returns all books for an author.
    Parameter series=series_id returns all books in a series.
    Parameter search=search_arg returns all books where search_arg is in title.
    :return:
    """
    page_number = int(request.args.get('page', ''))
    page_size = int(request.args.get('pagesize', ''))
    author_id = request.args.get('author', '')
    series_id = request.args.get('series', '')
    search_arg = request.args.get('search', '')
    sort_col = request.args.get('sortcol', '')
    sort_dir = request.args.get('sortdir', '')

    if author_id:
        logger.info("Books for author: %s", author_id)
    elif series_id:
        logger.info("Books for series: %s", series_id)
    elif search_arg:
        logger.info("Books containing: %s", search_arg)
    else:
        pass

    if author_id or series_id or search_arg:
        books = search_for_books_by_page(page_number, page_size, author_id, series_id, search_arg, sort_col, sort_dir)
    else:
        logger.info("All books")
        books = get_books_by_page(page_number, page_size, sort_col, sort_dir)

    json = jsonify({'data': books})
    return json
