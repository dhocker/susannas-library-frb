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
from models import Author
from sqlalchemy import func, or_
from app.models.models import db_session


def get_all_authors():
    return Author.query.order_by(func.lower(Author.LastName), func.lower(Author.FirstName)).all()


def search_for_authors(search_text):
    like = '%' + search_text + '%'
    return Author.query.filter(or_(Author.LastName.like(like), Author.FirstName.like(like)))\
        .order_by(func.lower(Author.LastName), func.lower(Author.FirstName)).all()


def get_page_of_authors(skip, page_size):
    return Author.query.order_by(func.lower(Author.LastName), func.lower(Author.FirstName)).slice(skip + 1, skip + page_size)


def get_author(id):
    return Author.query.get(id)


def update_author(author):
    db_session.commit()


def insert_author(last_name, first_name, category, try_author, avoid):
    a = Author(last_name, first_name, category, try_author, avoid)
    db_session.add(a)
    db_session.commit()


def delete_author_by_id(id):
    a = Author.query.get(id)
    db_session.delete(a)
    db_session.commit()

def author_exists(lastname, firstname):
    """
    Case insensitive check to see if an author exists
    :param lastname:
    :param firstname:
    :return: Returns the count of existing authors. If the author
    does not exist, returns 0.
    """
    c = Author.query.filter(func.lower(Author.LastName) == func.lower(lastname),
                            func.lower(Author.FirstName) == func.lower(firstname)).count()
    return c