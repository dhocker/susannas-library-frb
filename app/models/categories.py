# coding=utf-8
#
# Susanna's New Library - web app for managing Susan's vast library
# Copyright © 2016, 2018  Dave Hocker (email: AtHomeX10@gmail.com)
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

from app.models.models import Category
from sqlalchemy import func, or_
from app.models.models import db_session


def get_all_categories():
    q = Category.query
    count = q.count()
    rst = q.order_by(func.lower(Category.name).asc()).all()
    return {"rows": Category.rows2dictlist(rst), "count": count}

def get_category(category_id):
    return Category.query.get(category_id)

def get_category_as_dict(category_id):
    return Category.row2dict(Category.query.get(category_id))

def insert_category(name):
    s = Category(name)
    db_session.add(s)
    db_session.commit()

def category_exists(name):
    """
    Case insensitive check to see if a category exists
    :param name:
    :return: Returns the count of existing category. If the category
    does not exist, returns 0.
    """
    c = Category.query.filter(func.lower(Category.name) == func.lower(name)).count()
    return c

def update_category(category):
    db_session.commit()

def delete_category_by_id(id):
    """
    Delete a series and any related books.
    Note that this is a cascading delete.
    :param id:
    :return:
    """
    s = Category.query.get(id)
    db_session.delete(s)
    db_session.commit()
