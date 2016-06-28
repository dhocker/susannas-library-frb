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
from models import Author, Book
from sqlalchemy import func, or_
from sqlalchemy.orm import joinedload
from app.models.models import db_session


def get_all_books():
    # Here we force eager loading of the book authors. Over the long term, we might not
    # want to do this, but it does greatly speed up the overall query.
    return Book.query.options(joinedload('authors')).order_by(func.lower(Book.Title)).all()


def update_book(book):
    db_session.commit()


def insert_book(title, isbn, volume, series_id, author_id, category, status, cover, notes):
    author = Author.query.get(author_id)
    b = Book(title, isbn, volume, series_id, author, category, status, cover, notes)
    db_session.add(b)
    db_session.commit()
