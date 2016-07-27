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
from models import Author, Book, Collaborations, Series
from sqlalchemy import func, or_
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import text
from app.models.models import db_session, engine
from authors import get_author
import logging

logger = logging.getLogger("app")

def get_book(id):
    return Book.query.options(joinedload('authors')).get(id)

def get_books_in_series(series_id):
    return Book.query.filter_by(series_id=series_id)

def update_book(id, title, isbn, volume, series_id, author_id, category_id, status, cover, notes):
    book = get_book(id)
    book.Title = title
    book.ISBN = isbn
    if len(volume) == 0:
        book.Volume = None
    else:
        book.Volume = int(volume)
    book.series_id = series_id
    # If the author changed, update the association
    # Technically we can support multiple authors on a book. However, for now we're
    # only supporting one author.
    if len(book.authors) > 0:
        if book.authors[0].id != author_id:
            book.authors[0] = get_author(author_id)
    else:
        # No existing author. This should never be the case.
        # but the old database had some of these cases.
        book.authors.append(get_author(author_id))
    book.category_id = category_id
    book.Status = status
    book.CoverType = cover
    book.Notes = notes
    db_session.commit()


def insert_book(title, isbn, volume, series_id, author_id, category_id, status, cover, notes):
    author = Author.query.get(author_id)
    b = Book(title, isbn, volume, series_id, author, category_id, status, cover, notes)
    db_session.add(b)
    db_session.commit()


def delete_book_by_id(id):
    b = Book.query.get(id)
    db_session.delete(b)
    db_session.commit()
