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


def get_all_books():
    # Here we force eager loading of the book authors. Over the long term, we might not
    # want to do this, but it does greatly speed up the overall query.
    books = Book.query.order_by(func.lower(Book.Title)).all()
    return books_todict(books)

def get_books_by_page(page, pagesize, sort_col, sort_dir):
    q = db_session.query(Book).join(Collaborations, Collaborations.book_id==Book.id)
    q = q.join(Series, Series.id==Book.series_id)
    q = append_order_by_clause(q, sort_col, sort_dir)
    count = q.count();
    books = q.offset(page * pagesize).limit(pagesize)
    dict_books = books_todict(books)
    return {"rows": dict_books, "count": count}

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

def search_for_books(author_id, series_id, search_arg):
    q = db_session.query(Book).join(Collaborations, Collaborations.book_id==Book.id)
    q = q.join(Series, Series.id==Book.series_id)
    if author_id:
        # This appears to be slow, but it works for finding an author's books
        # q = q.filter(Book.authors.any(Author.id==author_id))
        # This technique appears to be much faster
        q = q.filter(Collaborations.author_id==author_id)
    elif series_id:
        q = q.filter(Book.series_id==series_id)
    if search_arg:
        s = "%" + search_arg + "%"
        q = q.filter(Book.Title.like(s))
    books = q.order_by(func.lower(Book.Title)).all()
    return books_todict(books)

def search_for_books_by_page(page, page_size, author_id, series_id, search_arg, sort_col, sort_dir):
    q = db_session.query(Book).join(Collaborations, Collaborations.book_id==Book.id)
    q = q.join(Author, Author.id==Collaborations.author_id)
    q = q.join(Series, Series.id==Book.series_id)
    if author_id:
        # This appears to be slow, but it works for finding an author's books
        # q = q.filter(Book.authors.any(Author.id==author_id))
        # This technique appears to be much faster
        q = q.filter(Book.series_id==series_id)
    elif series_id:
        q = q.filter(Book.series_id==series_id)
    if search_arg:
        s = "%" + search_arg + "%"
        q = q.filter(Book.Title.like(s))

    count = q.count()
    books = q.order_by(func.lower(Book.Title)).offset(page * page_size).limit(page_size)
    dict_books = books_todict(books)

    return {"rows": dict_books, "count": count}

def books_todict(books):
    ca = []
    for b in books:
        aa = Book.row2dict(b)
        # TODO This is model code and needs to be moved there
        if b.series:
            aa["Series"] = b.series.name
            aa["series_id"] = b.series.id
        else:
            aa["Series"] = ""
        author_str = ""
        # In the existing DB all books DO NOT have an author(s)
        # TODO This is extremely slow when ALL books are being fetched.
        # The authors appear to be a lazy secondary query using the
        # association table. Paging for all books is about the only
        # way to deal with this.
        if len(b.authors):
            author_str = b.authors[0].LastName
            if len(b.authors[0].FirstName):
                author_str += ", " + b.authors[0].FirstName
            aa["author_id"] = b.authors[0].id
            # Report books with multiple authors
            if (len(b.authors) > 1):
                logger.warn("Book id %s has %d authors", b.id, len(b.authors))
        else:
            logger.warn("Book id %s has no authors", b.id)
        # To condense the author field, we only show one author.
        # If there is more than one author, we mark the name with a "+".
        if len(b.authors) > 1:
            author_str += " +"
        aa["Author"] = author_str

        ca.append(aa)
    return ca

def append_order_by_clause(query, sort_col, sort_dir):
    # These are the column properties that are exposed (see Mixin class)
    # column_props = ["Title", "ISBN", "Volume", "series", "Published", "Category", "Status", "CoverType", "Notes", "id"]
    column_list = {
        "Title": Book.Title,
        "ISBN": Book.ISBN,
        "Volume": Book.Volume,
        "Series": Series.name,
        "Published": Book.Published,
        "Category": Book.Category,
        "Status": Book.Status,
        "CoverType": Book.CoverType,
        "Notes": Book.Notes,
        "id": Book.id
    }

    # TODO How to sort Author? Is it even possible?

    if sort_col in column_list:
        if sort_dir == "desc":
            q = query.order_by(func.lower(column_list[sort_col]).desc())
        else:
            q = query.order_by(func.lower(column_list[sort_col]).asc())
    else:
        q = query.order_by(func.lower(column_list["Title"]).asc())
    return q
