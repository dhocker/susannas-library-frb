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
from authors import get_author


def get_all_books():
    # Here we force eager loading of the book authors. Over the long term, we might not
    # want to do this, but it does greatly speed up the overall query.
    return Book.query.options(joinedload('authors')).order_by(func.lower(Book.Title)).all()

def get_book(id):
    return Book.query.options(joinedload('authors')).get(id)

def get_books_in_series(series_id):
    return Book.query.options(joinedload('authors')).filter_by(series_id=series_id)

def update_book(id, title, isbn, volume, series_id, author_id, category, status, cover, notes):
    book = get_book(id)
    book.Title = title
    book.ISBN = isbn
    book.Volume = volume
    book.series_id = series_id
    # If the author changed, update the association
    # Technically we can support multiple authors on a book. However, for now we're
    # only supporting one author.
    if book.authors[0].id != author_id:
        book.authors[0] = get_author(author_id)
    book.Category = category
    book.Status = status
    book.CoverType = cover
    book.Notes = notes
    db_session.commit()


def insert_book(title, isbn, volume, series_id, author_id, category, status, cover, notes):
    author = Author.query.get(author_id)
    b = Book(title, isbn, volume, series_id, author, category, status, cover, notes)
    db_session.add(b)
    db_session.commit()


def delete_book_by_id(id):
    b = Book.query.get(id)
    db_session.delete(b)
    db_session.commit()

def search_for_books(author_id, series_id, search_arg):
    q = Book.query.options(joinedload('authors'))
    if author_id:
        # This appears to be slow, but it works for finding an author's books
        q = q.filter(Book.authors.any(Author.id==author_id))
    elif series_id:
        q = q.filter(Book.series_id==series_id)
    if search_arg:
        s = "%" + search_arg + "%"
        q = q.filter(Book.Title.like(s))
    return q.order_by(func.lower(Book.Title)).all()