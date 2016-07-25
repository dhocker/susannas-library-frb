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
from models import Author, Category
from sqlalchemy import func, or_
from sqlalchemy.orm import joinedload
from app.models.models import db_session
from app.models.categories import get_category


def get_all_authors(page, pagesize, sort_col, sort_dir):
    q = append_order_by_clause(Author.query, sort_col, sort_dir)
    if pagesize > 0:
        authors = q.limit(pagesize).offset(page * pagesize).all()
    else:
        authors = q.offset(page * pagesize).all()
    count = q.count()
    return {"rows": authors_todict(authors), "count": count}


def search_for_authors(page_number, page_size, category_id, search_arg, sort_col, sort_dir):
    q = append_order_by_clause(Author.query, sort_col, sort_dir)
    if category_id:
        q = q.filter(Author.category_id==category_id)
    if search_arg:
        like = '%' + search_arg + '%'
        q = q.filter(or_(Author.LastName.like(like), Author.FirstName.like(like)))
    count = q.count()
    authors =  q.limit(page_size).offset(page_number * page_size)
    return {"rows": authors_todict(authors), "count": count}

def append_order_by_clause(query, sort_col, sort_dir):
    column_list = {
        "LastName": Author.LastName,
        "FirstName": Author.FirstName,
        # TODO Category does not work
        # "category": Category.name,
        "try_author": Author.try_author,
        "Avoid": Author.Avoid,
        "id": Author.id
    }

    if sort_col in column_list:
        if sort_dir == "desc":
            # Handle LastName as a special case (sort last, first name)
            if sort_col == "LastName":
                q = query.order_by(func.lower(Author.LastName).desc(), func.lower(Author.FirstName).desc())
            else:
                q = query.order_by(func.lower(column_list[sort_col]).desc())
        else:
            # Handle LastName as a special case (sort last, first name)
            if sort_col == "LastName":
                q = query.order_by(func.lower(Author.LastName).asc(), func.lower(Author.FirstName).asc())
            else:
                q = query.order_by(func.lower(column_list[sort_col]).asc())
    else:
        q = query.order_by(func.lower(column_list["LastName"]).asc())
    return q

def get_author(id):
    return Author.query.options(joinedload('books')).get(id)


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

def authors_todict(authors):
    """
    Convert a set of authors into a list of dicts
    :param authors:
    :return:
    """
    ca = []
    for a in authors:
        aa = Author.row2dict(a)
        # This replaces the original category field
        if a.category_link:
            aa["category"] = a.category_link.name
        else:
            aa["category"] = '<Empty>'
        if aa["try_author"] == 1:
            aa["try_author"] = "Try"
        else:
            aa["try_author"] = ""
        if aa["Avoid"] == 1:
            aa["Avoid"] = "Avoid"
        else:
            aa["Avoid"] = ""
        ca.append(aa)
    return ca